import db from '../config/db.js'

export const BusinessSector = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM business_sector')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM business_sector WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name) {
    const [result] = await db.query(
      'INSERT INTO business_sector (name) VALUES (?)',
      [name]
    )
    return { id: result.insertId, name }
  },

  async update(id, name) {
    await db.query('UPDATE business_sector SET name = ? WHERE id = ?', [
      name,
      id,
    ])
    return { id, name }
  },

  async remove(id) {
    await db.query('DELETE FROM business_sector WHERE id = ?', [id])
    return { message: 'Business sector deleted successfully' }
  },
}
