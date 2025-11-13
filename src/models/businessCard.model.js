import db from '../config/db.js'

export const BusinessCard = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM business_card')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM business_card WHERE id = ?', [
      id,
    ])
    return rows[0]
  },

  async create(url) {
    const [result] = await db.query(
      'INSERT INTO business_card (url) VALUES (?)',
      [url]
    )
    return { id: result.insertId, url }
  },

  async update(id, url) {
    await db.query('UPDATE logo SET url = ? WHERE id = ?', [url, id])
    return { id, url }
  },

  async remove(id) {
    await db.query('DELETE FROM business_card WHERE id = ?', [id])
    return { message: 'business_card deleted successfully' }
  },
}
