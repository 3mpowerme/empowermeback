import db from '../config/db.js'

export async function autoAssignPaidServiceOrder({ serviceOrderId }) {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const [soRows] = await conn.query(
      `SELECT id, service_id, payment_status
       FROM service_orders
       WHERE id = ?
       FOR UPDATE`,
      [serviceOrderId]
    )

    if (!soRows.length) {
      await conn.commit()
      return { assigned: false, reason: 'service_order_not_found' }
    }
    console.log('AutoAssignPaidServiceOrder soRows', soRows)
    const serviceOrder = soRows[0]
    if (serviceOrder.payment_status !== 'paid') {
      await conn.commit()
      return { assigned: false, reason: 'service_order_not_paid' }
    }
    console.log('AutoAssignPaidServiceOrder serviceOrder', serviceOrder)
    const [existingRows] = await conn.query(
      `SELECT user_id
       FROM service_order_assignees
       WHERE service_order_id = ?
       FOR UPDATE`,
      [serviceOrderId]
    )

    if (existingRows.length) {
      await conn.commit()
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
    console.log('AutoAssignPaidServiceOrder candidateRows', candidateRows)
    if (!candidateRows.length) {
      await conn.commit()
      return { assigned: false, reason: 'no_candidates' }
    }

    const candidateIds = candidateRows.map((r) => r.user_id)
    console.log('AutoAssignPaidServiceOrder candidateIds', candidateIds)

    const [statsRows] = await conn.query(
      `SELECT
          c.user_id,
          COALESCE(s.active_same_service, 0) AS active_same_service,
          COALESCE(t.active_total, 0) AS active_total,
          ls.last_assigned_at
       FROM (
          SELECT ? AS service_id, u.user_id
          FROM (SELECT CAST(? AS UNSIGNED) AS service_id) x
          JOIN (
            ${candidateIds.map(() => 'SELECT ? AS user_id').join(' UNION ALL ')}
          ) u
       ) c
       LEFT JOIN (
          SELECT soa.user_id, COUNT(*) AS active_same_service
          FROM service_order_assignees soa
          JOIN service_orders so ON so.id = soa.service_order_id
          WHERE soa.user_id IN (${candidateIds.map(() => '?').join(',')})
            AND so.payment_status = 'paid'
            AND so.fulfillment_status IN ('created','in_progress')
            AND so.service_id = ?
          GROUP BY soa.user_id
       ) s ON s.user_id = c.user_id
       LEFT JOIN (
          SELECT soa.user_id, COUNT(*) AS active_total
          FROM service_order_assignees soa
          JOIN service_orders so ON so.id = soa.service_order_id
          WHERE soa.user_id IN (${candidateIds.map(() => '?').join(',')})
            AND so.payment_status = 'paid'
            AND so.fulfillment_status IN ('created','in_progress')
          GROUP BY soa.user_id
       ) t ON t.user_id = c.user_id
       LEFT JOIN (
          SELECT soa.user_id, MAX(soa.assigned_at) AS last_assigned_at
          FROM service_order_assignees soa
          JOIN service_orders so ON so.id = soa.service_order_id
          WHERE soa.user_id IN (${candidateIds.map(() => '?').join(',')})
            AND so.service_id = ?
          GROUP BY soa.user_id
       ) ls ON ls.user_id = c.user_id`,
      [
        serviceId,
        serviceId,
        ...candidateIds,
        ...candidateIds,
        serviceId,
        ...candidateIds,
        ...candidateIds,
        serviceId,
      ]
    )

    console.log('AutoAssignPaidServiceOrder statsRows', statsRows)

    const statsByUser = new Map()
    for (const r of statsRows) statsByUser.set(r.user_id, r)
    console.log('AutoAssignPaidServiceOrder statsByUser', statsByUser)
    const enriched = candidateIds.map((userId) => {
      const s = statsByUser.get(userId) || {}
      return {
        userId,
        activeSameService: Number(s.active_same_service || 0),
        activeTotal: Number(s.active_total || 0),
        lastAssignedAt: s.last_assigned_at
          ? new Date(s.last_assigned_at).getTime()
          : null,
      }
    })

    console.log('AutoAssignPaidServiceOrder enriched', enriched)
    const available = enriched.filter((x) => x.activeSameService === 0)
    console.log('AutoAssignPaidServiceOrder available', available)
    let chosen
    if (available.length) {
      chosen = available.slice().sort((a, b) => {
        if (a.lastAssignedAt === null && b.lastAssignedAt !== null) return -1
        if (a.lastAssignedAt !== null && b.lastAssignedAt === null) return 1
        if (
          a.lastAssignedAt !== null &&
          b.lastAssignedAt !== null &&
          a.lastAssignedAt !== b.lastAssignedAt
        )
          return a.lastAssignedAt - b.lastAssignedAt
        return a.userId - b.userId
      })[0]
    } else {
      chosen = enriched.slice().sort((a, b) => {
        if (a.activeTotal !== b.activeTotal)
          return a.activeTotal - b.activeTotal
        if (a.lastAssignedAt === null && b.lastAssignedAt !== null) return -1
        if (a.lastAssignedAt !== null && b.lastAssignedAt === null) return 1
        if (
          a.lastAssignedAt !== null &&
          b.lastAssignedAt !== null &&
          a.lastAssignedAt !== b.lastAssignedAt
        )
          return a.lastAssignedAt - b.lastAssignedAt
        return a.userId - b.userId
      })[0]
    }

    if (!chosen) {
      await conn.commit()
      return { assigned: false, reason: 'no_choice' }
    }
    console.log('AutoAssignPaidServiceOrder chosen', chosen)

    await conn.query(
      `INSERT INTO service_order_assignees (service_order_id, user_id, assigned_by_user_id)
       VALUES (?, ?, NULL)`,
      [serviceOrderId, chosen.userId]
    )
    console.log(
      'AutoAssignPaidServiceOrder assigned serviceOrderId to userId',
      serviceOrderId,
      chosen.userId
    )
    await conn.commit()
    return {
      assigned: true,
      userId: chosen.userId,
      reason: available.length
        ? 'round_robin_available'
        : 'least_loaded_fallback',
    }
  } catch (err) {
    try {
      await conn.rollback()
    } catch (e) {}

    if (String(err && err.code) === 'ER_DUP_ENTRY') {
      return { assigned: false, reason: 'duplicate_assignment_race' }
    }
    throw err
  } finally {
    try {
      conn.release()
    } catch (e) {}
  }
}
