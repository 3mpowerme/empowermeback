import db from '../config/db.js'

export const CommercialMovement = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM commercial_movements')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM commercial_movements WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name) {
    const [result] = await db.query(
      'INSERT INTO commercial_movements (name) VALUES (?)',
      [name]
    )
    return { id: result.insertId, name }
  },

  async update(id, name) {
    await db.query('UPDATE commercial_movements SET name = ? WHERE id = ?', [
      name,
      id,
    ])
    return { id, name }
  },

  async remove(id) {
    await db.query('DELETE FROM commercial_movements WHERE id = ?', [id])
    return { message: 'Commercial movements deleted successfully' }
  },
}
