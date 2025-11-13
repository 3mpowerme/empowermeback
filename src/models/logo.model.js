import db from '../config/db.js'

export const Logo = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM logo')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM logo WHERE id = ?', [id])
    return rows[0]
  },

  async create(url) {
    const [result] = await db.query('INSERT INTO logo (url) VALUES (?)', [url])
    return { id: result.insertId, url }
  },

  async update(id, url) {
    await db.query('UPDATE logo SET url = ? WHERE id = ?', [url, id])
    return { id, url }
  },

  async remove(id) {
    await db.query('DELETE FROM logo WHERE id = ?', [id])
    return { message: 'Logo deleted successfully' }
  },
}
