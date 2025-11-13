import db from '../config/db.js'

export const TodayFocus = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM today_focus')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM today_focus WHERE id = ?', [
      id,
    ])
    return rows[0]
  },

  async getTodayFocusByCompanyId(id) {
    const [rows] = await db.query(
      'SELECT tf.name as todayFocus FROM today_focus as tf, today_focus_responses as tfr, companies as c WHERE c.id = tfr.company_id AND tfr.today_focus_id = tf.id AND c.id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name, image) {
    const [result] = await db.query(
      'INSERT INTO today_focus (name, image) VALUES (?,?)',
      [name, image]
    )
    return { id: result.insertId, name, image }
  },

  async update(id, name, image) {
    await db.query(
      'UPDATE business_sector SET name = ?, SET image = ? WHERE id = ?',
      [name, id, image]
    )
    return { id, name, image }
  },

  async remove(id) {
    await db.query('DELETE FROM business_sector WHERE id = ?', [id])
    return { message: 'Today focus deleted successfully' }
  },
}
