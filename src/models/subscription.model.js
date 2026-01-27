import db from '../config/db.js'

export const Subscription = {
  async getByExternalSubscriptionId(id) {
    const [rows] = await db.query(
      `select * from subscriptions where external_subscription_id = ?`,
      [id]
    )

    return rows[0]
  },

  async getPlan(planId) {
    const [[plan]] = await db.query(
      `SELECT
         id,
         service_id,
         code,
         name,
         currency,
         how_often,
         interval_count,
         amount_cents,
         stripe_price_id
       FROM plans
       WHERE id = ?
         AND is_active = 1
       LIMIT 1`,
      [planId]
    )
    return plan || null
  },

  async hasActiveSubscriptionForService(companyId, serviceId) {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM subscriptions s
      INNER JOIN plans p
        ON p.id = s.plan_id
      WHERE s.company_id = ?
        AND p.service_id = ?
        AND s.status IN ('trialing', 'active', 'past_due')
      `,
      [companyId, serviceId]
    )

    return rows[0]?.count > 0
  },

  async upsertLocalSubscriptionDraft({
    companyId,
    planId,
    provider,
    externalSubscriptionId,
    status,
    cancelAtPeriodEnd,
    currentPeriodStart,
    currentPeriodEnd,
  }) {
    const [result] = await db.query(
      `INSERT INTO subscriptions (
         company_id,
         plan_id,
         provider,
         external_subscription_id,
         status,
         current_period_start,
         current_period_end,
         cancel_at_period_end
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         plan_id = VALUES(plan_id),
         status = VALUES(status),
         current_period_start = VALUES(current_period_start),
         current_period_end = VALUES(current_period_end),
         cancel_at_period_end = VALUES(cancel_at_period_end),
         updated_at = CURRENT_TIMESTAMP`,
      [
        companyId,
        planId,
        provider,
        externalSubscriptionId,
        status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd ? 1 : 0,
      ]
    )
    return result.insertId
  },

  async upsertSubscriptionFromStripe(sub) {
    console.log('upsertSubscriptionFromStripe sub', sub)
    console.log('sub.current_period_start', sub.current_period_start)
    console.log('sub.current_period_end', sub.current_period_end)
    console.log('sub status', sub.status)
    console.log('sub metadata', sub.metadata)

    const [result] = await db.query(
      `INSERT INTO subscriptions (
         company_id,
         plan_id,
         provider,
         external_subscription_id,
         status,
         current_period_start,
         current_period_end,
         cancel_at_period_end
       )
       VALUES (
         ?, ?,
         'stripe',
         ?, ?,
         FROM_UNIXTIME(?),
         FROM_UNIXTIME(?),
         ?
       )
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         current_period_start = VALUES(current_period_start),
         current_period_end = VALUES(current_period_end),
         cancel_at_period_end = VALUES(cancel_at_period_end),
         updated_at = CURRENT_TIMESTAMP`,
      [
        Number(sub.metadata.company_id),
        Number(sub.metadata.plan_id),
        sub.id,
        sub.status,
        sub.current_period_start || sub.created || null,
        sub.current_period_end || sub.cancel_at || null,
        sub.cancel_at_period_end ? 1 : 0,
      ]
    )
    if (sub.status === 'active') {
      console.log('update service_orders')
      await db.query(
        `UPDATE service_orders set payment_status = 'paid' where subscription_id = ?`,
        [result.insertId]
      )
    }

    return result.insertId
  },

  async markPastDueByExternalId(externalSubscriptionId) {
    await db.query(
      `UPDATE subscriptions
       SET status = 'past_due',
           updated_at = CURRENT_TIMESTAMP
       WHERE external_subscription_id = ?
       LIMIT 1`,
      [externalSubscriptionId]
    )
  },

  async markCanceledByExternalId(externalSubscriptionId) {
    await db.query(
      `UPDATE subscriptions
       SET status = 'canceled',
           updated_at = CURRENT_TIMESTAMP
       WHERE external_subscription_id = ?
       LIMIT 1`,
      [externalSubscriptionId]
    )
  },
  async getActiveSubscriptionsByCompany(companyId) {
    const [rows] = await db.query(
      `
    SELECT
      s.id                         AS subscription_id,
      s.external_subscription_id   AS external_subscription_id,
      s.status                     AS status,
      s.current_period_start       AS current_period_start,
      s.current_period_end         AS current_period_end,
      s.cancel_at_period_end       AS cancel_at_period_end,

      p.id                         AS plan_id,
      p.name                       AS plan_name,
      p.service_id                 AS service_id,
      p.currency                   AS currency,
      p.amount_cents               AS amount_cents,
      p.how_often                  AS how_often,
      p.interval_count             AS interval_count

    FROM subscriptions s
    INNER JOIN plans p
      ON p.id = s.plan_id
    WHERE s.company_id = ?
      AND s.status IN ('trialing','active','past_due')
    ORDER BY s.current_period_end DESC
    `,
      [companyId]
    )

    return rows
  },
}
