import db from '../config/db.js'

export const Feature = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM feature')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM feature WHERE id = ?', [id])
    return rows[0]
  },

  async create(name, image, link) {
    const [result] = await db.query(
      'INSERT INTO feature (name, image, link) VALUES (?,?,?)',
      [name, image, link]
    )
    return { id: result.insertId, name, image, link }
  },

  async update(id, name, image) {
    await db.query(
      'UPDATE feature SET name = ?, SET image = ?, SET link=? WHERE id = ?',
      [name, id, image]
    )
    return { id, name, image }
  },

  async remove(id) {
    await db.query('DELETE FROM feature WHERE id = ?', [id])
    return { message: 'feature deleted successfully' }
  },
}
