import db from '../config/db.js'

export const LogoHistory = {
  async getAll(table) {
    const [rows] = await db.query(`SELECT * FROM ${table}_logo_history`)
    return rows
  },

  async getByCompanyId(table, id) {
    const [rows] = await db.query(
      `SELECT lh.id as history_id, l.url as logo_url, l.created_at as logo_created_at FROM ${table}_logo_history as lh, logo as l WHERE lh.company_id = ? and lh.logo_id=l.id`,
      [id]
    )
    return rows
  },

  async create(table, logo_id, company_id) {
    const [result] = await db.query(
      `INSERT INTO ${table}_logo_history (logo_id, ${table}_id) VALUES (?,?)`,
      [logo_id, company_id]
    )
    return { id: result.insertId }
  },

  async remove(table, id) {
    await db.query(`DELETE FROM ${table}_logo_history WHERE id = ?`, [id])
    return { message: 'Logo history deleted successfully' }
  },
}
