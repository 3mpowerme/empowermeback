import db from '../config/db.js'

export const Service = {
  async getAll(activeOnly = false) {
    const [rows] = await db.query(
      activeOnly
        ? `SELECT * FROM services WHERE is_active = 1`
        : `SELECT * FROM services`
    )
    return rows
  },

  async getServiceById(id) {
    const [rows] = await db.execute(`SELECT * FROM services WHERE id = ?`, [id])
    return rows[0] || null
  },

  async getByCode(code) {
    const [rows] = await db.query('SELECT * FROM services WHERE code = ?', [
      code,
    ])
    return rows[0]
  },

  async create(code, name, description, default_currency) {
    const [result] = await db.query(
      'INSERT INTO services(code, name, description, default_currency ) values VALUES (?,?,?,?)',
      [code, name, description, default_currency]
    )
    return { id: result.insertId, code, name, description, default_currency }
  },
}
