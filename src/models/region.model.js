import db from '../config/db.js'

export const Region = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM region')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM region WHERE id = ?', [id])
    return rows[0]
  },

  async create(name) {
    const [result] = await db.query('INSERT INTO region (name) VALUES (?)', [
      name,
    ])
    return { id: result.insertId, name }
  },

  async update(id, name) {
    await db.query('UPDATE region SET name = ? WHERE id = ?', [name, id])
    return { id, name }
  },

  async remove(id) {
    await db.query('DELETE FROM region WHERE id = ?', [id])
    return { message: 'Region deleted successfully' }
  },
}
