import db from '../config/db.js'

export const Plan = {
  async getPlanById(id) {
    const [rows] = await db.query(
      `SELECT *
     FROM plans
     WHERE id = ?`,
      [id]
    )
    return rows[0] || null
  },

  async getPlanByCode(code) {
    const [rows] = await db.query(`SELECT * FROM plans WHERE code = ?`, [code])
    return rows[0] || null
  },

  async create(
    code,
    name,
    description,
    currency,
    how_often,
    amount_cents,
    stripe_product_id,
    stripe_price_id,
    is_active
  ) {
    const [result] = await db.query(
      'INSERT INTO plans(code, name, description, currency, how_often, amount_cents, stripe_product_id, stripe_price_id, is_active) values VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        code,
        name,
        description || null,
        currency,
        how_often,
        amount_cents,
        stripe_product_id,
        stripe_price_id,
        is_active ? 1 : 0,
      ]
    )
    return { id: result.insertId }
  },
  async getPlans(activeOnly) {
    const [rows] = await db.query(
      activeOnly
        ? `SELECT * FROM plans WHERE is_active = 1`
        : `SELECT * FROM plans`
    )
    return rows
  },

  async getPlansByServiceCode(service_code) {
    const [rows] = await db.query(
      `SELECT p.id, p.code, p.name, p.description, p.includes, p.currency, p.how_often, p.interval_count, p.amount_cents 
     FROM plans as p, services as s 
     WHERE p.is_active = 1 AND p.service_id = s.id AND s.code = ?`,
      [service_code]
    )

    const parsed = rows.map((r) => ({
      ...r,
      includes: r.includes ? JSON.parse(r.includes) : [],
    }))

    return parsed
  },
}
