import db from '../config/db.js'

export const PlanServiceModel = {
  async attachServiceToPlan(
    plan_id,
    service_id,
    is_enabled,
    max_credits_per_period,
    period
  ) {
    await db.execute(
      `INSERT INTO plan_services
      (plan_id, service_id, is_enabled, max_credits_per_period, period)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        is_enabled = VALUES(is_enabled),
        max_credits_per_period = VALUES(max_credits_per_period),
        period = VALUES(period),
        updated_at = CURRENT_TIMESTAMP`,
      [
        plan_id,
        service_id,
        is_enabled ? 1 : 0,
        max_credits_per_period || null,
        period || null,
      ]
    )
  },

  async detachServiceFromPlan(plan_id, service_id) {
    await db.execute(
      `DELETE FROM plan_services
     WHERE plan_id = ? AND service_id = ?`,
      [plan_id, service_id]
    )
  },

  async listServicesForPlan(plan_id) {
    const [rows] = await db.execute(
      `SELECT
        ps.service_id,
        ps.is_enabled,
        ps.max_credits_per_period,
        ps.period,
        s.code AS service_code,
        s.name AS service_name,
        s.description AS service_description
     FROM plan_services ps
     INNER JOIN services s ON s.id = ps.service_id
     WHERE ps.plan_id = ?`,
      [plan_id]
    )
    return rows
  },
}
