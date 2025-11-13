import db from '../config/db.js'

export const PlanFeature = {
  async listPlanFeatures(plan_id) {
    const [rows] = await db.execute(
      `SELECT code, value
     FROM plan_features
     WHERE plan_id = ?`,
      [plan_id]
    )
    return rows
  },

  async upsertPlanFeature(plan_id, code, value) {
    await db.query(
      `INSERT INTO plan_features (plan_id, code, value)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      [plan_id, code, value]
    )
    return { id: result.insertId }
  },
  async removePlanFeature(plan_id, code) {
    await db.execute(
      `DELETE FROM plan_features WHERE plan_id = ? AND code = ?`,
      [plan_id, code]
    )
  },
}
