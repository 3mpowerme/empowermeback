import db from '../config/db.js'

export const Company = {
  async getCompanyIdByUserId(userId) {
    const [rows] = await db.query(
      'SELECT id FROM companies where owner_user_id = ?',
      [userId]
    )
    return rows[0]
  },
  async getCompanyById(id) {
    const [rows] = await db.query('SELECT * FROM companies where id = ?', [id])
    return rows[0]
  },
  async getAll(userId) {
    const [rows] = await db.query(
      'SELECT * FROM companies where owner_user_id = ?',
      [userId]
    )
    return rows
  },

  async create(userId, name) {
    const [result] = await db.query(
      'INSERT INTO companies (owner_user_id, name) VALUES (?,?)',
      [userId, name]
    )
    console.log('result', result)
    return { companyId: result.insertId }
  },
}
