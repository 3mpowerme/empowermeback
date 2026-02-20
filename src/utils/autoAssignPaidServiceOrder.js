import db from '../config/db.js'

export async function autoAssignPaidServiceOrder({ serviceOrderId }) {
  const conn = await db.getConnection()
  const traceId = `aso_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
  const log = (event, payload = {}) =>
    console.log(
      '[AutoAssignPaidServiceOrder]',
      JSON.stringify({ traceId, event, serviceOrderId, ...payload })
    )

  try {
    await conn.beginTransaction()
    log('tx_begin')

    const [soRows] = await conn.query(
      `SELECT id, service_id, payment_status, fulfillment_status
       FROM service_orders
       WHERE id = ?
       FOR UPDATE`,
      [serviceOrderId]
    )

    if (!soRows.length) {
      log('service_order_not_found')
      await conn.commit()
      log('tx_commit')
      return { assigned: false, reason: 'service_order_not_found' }
    }

    const serviceOrder = soRows[0]
    log('service_order_loaded', {
      serviceId: serviceOrder.service_id,
      paymentStatus: serviceOrder.payment_status,
      fulfillmentStatus: serviceOrder.fulfillment_status,
    })

    if (serviceOrder.payment_status !== 'paid') {
      log('service_order_not_paid', {
        paymentStatus: serviceOrder.payment_status,
      })
      await conn.commit()
      log('tx_commit')
      return { assigned: false, reason: 'service_order_not_paid' }
    }

    const [existingRows] = await conn.query(
      `SELECT user_id
       FROM service_order_assignees
       WHERE service_order_id = ?
       FOR UPDATE`,
      [serviceOrderId]
    )

    if (existingRows.length) {
      log('already_assigned', { userId: existingRows[0].user_id })
      await conn.commit()
      log('tx_commit')
      return {
        assigned: true,
        userId: existingRows[0].user_id,
        reason: 'already_assigned',
      }
    }

    const serviceId = serviceOrder.service_id

    const [candidateRows] = await conn.query(
      `SELECT u.id AS user_id
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.id AND ur.role_id = 2
       JOIN user_services us ON us.user_id = u.id AND us.service_id = ? AND us.is_enabled = 1
       GROUP BY u.id`,
      [serviceId]
    )

    log('candidates_loaded', {
      serviceId,
      candidatesCount: candidateRows.length,
    })

    if (!candidateRows.length) {
      log('no_candidates', { serviceId })
      await conn.commit()
      log('tx_commit')
      return { assigned: false, reason: 'no_candidates' }
    }

    const candidateIds = candidateRows.map((r) => Number(r.user_id))
    log('candidate_ids', { candidateIds })

    const unionCandidates = candidateIds
      .map(() => 'SELECT ? AS user_id')
      .join(' UNION ALL ')
    const inCandidates = candidateIds.map(() => '?').join(',')

    const [statsRows] = await conn.query(
      `SELECT
          c.user_id,
          COALESCE(w.active_working_total, 0) AS active_working_total,
          COALESCE(w.active_created, 0) AS active_created,
          COALESCE(w.active_in_progress, 0) AS active_in_progress,
          la.last_assigned_at
       FROM (
          ${unionCandidates}
       ) c
       LEFT JOIN (
          SELECT
            soa.user_id,
            SUM(CASE WHEN so.fulfillment_status IN ('created','in_progress') AND so.payment_status='paid' THEN 1 ELSE 0 END) AS active_working_total,
            SUM(CASE WHEN so.fulfillment_status = 'created' AND so.payment_status='paid' THEN 1 ELSE 0 END) AS active_created,
            SUM(CASE WHEN so.fulfillment_status = 'in_progress' AND so.payment_status='paid' THEN 1 ELSE 0 END) AS active_in_progress
          FROM service_order_assignees soa
          JOIN service_orders so ON so.id = soa.service_order_id
          WHERE soa.user_id IN (${inCandidates})
          GROUP BY soa.user_id
       ) w ON w.user_id = c.user_id
       LEFT JOIN (
          SELECT soa.user_id, MAX(soa.assigned_at) AS last_assigned_at
          FROM service_order_assignees soa
          WHERE soa.user_id IN (${inCandidates})
          GROUP BY soa.user_id
       ) la ON la.user_id = c.user_id`,
      [...candidateIds, ...candidateIds, ...candidateIds]
    )

    log('stats_loaded', { statsRows })

    const statsByUser = new Map()
    for (const r of statsRows) statsByUser.set(Number(r.user_id), r)

    const enriched = candidateIds.map((userId) => {
      const s = statsByUser.get(userId) || {}
      return {
        userId,
        activeWorkingTotal: Number(s.active_working_total || 0),
        activeCreated: Number(s.active_created || 0),
        activeInProgress: Number(s.active_in_progress || 0),
        lastAssignedAt: s.last_assigned_at
          ? new Date(s.last_assigned_at).getTime()
          : null,
      }
    })

    log('enriched_candidates', { enriched })

    const fullyAvailable = enriched.filter((x) => x.activeWorkingTotal === 0)
    log('fully_available', {
      count: fullyAvailable.length,
      users: fullyAvailable.map((x) => x.userId),
    })

    let chosen = null
    let reason = null

    const sortByRoundRobin = (a, b) => {
      if (a.lastAssignedAt === null && b.lastAssignedAt !== null) return -1
      if (a.lastAssignedAt !== null && b.lastAssignedAt === null) return 1
      if (
        a.lastAssignedAt !== null &&
        b.lastAssignedAt !== null &&
        a.lastAssignedAt !== b.lastAssignedAt
      )
        return a.lastAssignedAt - b.lastAssignedAt
      return a.userId - b.userId
    }

    if (fullyAvailable.length) {
      chosen = fullyAvailable.slice().sort(sortByRoundRobin)[0]
      reason = 'round_robin_available_no_working_orders'
    } else {
      chosen = enriched.slice().sort((a, b) => {
        if (a.activeCreated !== b.activeCreated)
          return a.activeCreated - b.activeCreated
        if (a.activeWorkingTotal !== b.activeWorkingTotal)
          return a.activeWorkingTotal - b.activeWorkingTotal
        return sortByRoundRobin(a, b)
      })[0]
      reason = 'least_loaded_fallback_no_free_exec'
    }

    if (!chosen) {
      log('no_choice')
      await conn.commit()
      log('tx_commit')
      return { assigned: false, reason: 'no_choice' }
    }

    log('chosen', { chosen, reason })

    await conn.query(
      `INSERT INTO service_order_assignees (service_order_id, user_id, assigned_by_user_id)
       VALUES (?, ?, NULL)`,
      [serviceOrderId, chosen.userId]
    )

    log('assigned', { userId: chosen.userId })

    await conn.commit()
    log('tx_commit')

    await createCompanyNotification({
      userId: chosen.userId,
      title: 'Nueva asignación',
      message: 'Tienes una assignación, da clic para verlo',
      type: 'info',
      metadata: { url: '/dashboard/services' },
    })

    return { assigned: true, userId: chosen.userId, reason }
  } catch (err) {
    try {
      await conn.rollback()
      console.log(
        '[AutoAssignPaidServiceOrder]',
        JSON.stringify({ traceId, event: 'tx_rollback', serviceOrderId })
      )
    } catch (e) {}

    if (String(err && err.code) === 'ER_DUP_ENTRY') {
      console.log(
        '[AutoAssignPaidServiceOrder]',
        JSON.stringify({
          traceId,
          event: 'duplicate_assignment_race',
          serviceOrderId,
        })
      )
      return { assigned: false, reason: 'duplicate_assignment_race' }
    }

    console.log(
      '[AutoAssignPaidServiceOrder]',
      JSON.stringify({
        traceId,
        event: 'error',
        serviceOrderId,
        code: err && err.code,
        message: err && err.message,
      })
    )
    throw err
  } finally {
    try {
      conn.release()
    } catch (e) {}
  }
}

export async function getActiveSubscriptionAndLastServiceOrderByEmail(email) {
  const conn = await db.getConnection()
  try {
    const [subRows] = await conn.query(
      `SELECT
         u.id AS user_id,
         c.id AS company_id,
         s.id AS subscription_id,
         s.status AS subscription_status,
         s.current_period_end
       FROM users u
       JOIN companies c ON c.owner_user_id = u.id
       JOIN subscriptions s ON s.company_id = c.id
       WHERE u.email = ?
         AND s.status = 'active'
       ORDER BY
         COALESCE(s.current_period_end, s.updated_at, s.created_at) DESC,
         s.id DESC
       LIMIT 1`,
      [email]
    )

    if (!subRows.length) {
      return { ok: false, reason: 'active_subscription_not_found' }
    }

    const sub = subRows[0]

    const [orderRows] = await conn.query(
      `SELECT
         so.*
       FROM service_orders so
       WHERE so.subscription_id = ?
       ORDER BY so.created_at DESC, so.id DESC
       LIMIT 1`,
      [sub.subscription_id]
    )

    return {
      ok: true,
      userId: sub.user_id,
      companyId: sub.company_id,
      subscriptionId: sub.subscription_id,
      subscriptionStatus: sub.subscription_status,
      lastServiceOrder: orderRows.length ? orderRows[0] : null,
    }
  } finally {
    try {
      conn.release()
    } catch (e) {}
  }
}

export async function createCompanyNotification({
  userId = null,
  companyId = null,
  title,
  message,
  type = 'info',
  metadata = null,
}) {
  if (!title) throw new Error('title is required')
  if (!message) throw new Error('message is required')
  if (!type) throw new Error('type is required')
  if (!userId && !companyId) throw new Error('userId or companyId is required')
  if (userId && companyId)
    throw new Error('provide only one: userId or companyId')

  const metadataJson =
    metadata && typeof metadata === 'object' ? JSON.stringify(metadata) : null

  const cols = []
  const placeholders = []
  const values = []

  if (userId) {
    cols.push('user_id')
    placeholders.push('?')
    values.push(userId)
  }

  if (companyId) {
    cols.push('company_id')
    placeholders.push('?')
    values.push(companyId)
  }

  cols.push('title', 'message', 'type', 'metadata')
  placeholders.push('?', '?', '?', '?')
  values.push(title, message, type, metadataJson)

  const [result] = await db.query(
    `INSERT INTO company_notifications (${cols.join(', ')})
     VALUES (${placeholders.join(', ')})`,
    values
  )

  return {
    id: result.insertId,
    userId,
    companyId,
    title,
    message,
    type,
    metadata,
  }
}

export async function getLastActiveServiceOrderAssigneeUserIdByCompanyAndServiceCode({
  companyId,
  serviceCode,
}) {
  if (!companyId) throw new Error('companyId is required')
  if (!serviceCode) throw new Error('serviceCode is required')

  const [rows] = await db.query(
    `SELECT
       soa.user_id
     FROM service_orders so
     JOIN services s ON s.id = so.service_id
     JOIN service_order_assignees soa ON soa.service_order_id = so.id
     WHERE so.company_id = ?
       AND s.code = ?
       AND so.fulfillment_status IN ('created','in_progress','finished')
     ORDER BY so.created_at DESC, so.id DESC
     LIMIT 1`,
    [companyId, serviceCode]
  )

  return rows.length ? rows[0].user_id : null
}
