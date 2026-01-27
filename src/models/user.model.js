import db from '../config/db.js'

export const User = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM users')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id])
    return rows[0]
  },

  async create(email, country_id) {
    const [result] = await db.query(
      'INSERT INTO users (email, country_id) VALUES (?,?)',
      [email, country_id]
    )
    await db.query('INSERT INTO user_roles(user_id, role_id) values (?, 3)', [
      result.insertId,
    ])
    return { id: result.insertId, email, country_id }
  },

  async remove(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id])
    return { message: 'User deleted successfully' }
  },
}
