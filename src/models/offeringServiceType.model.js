import db from '../config/db.js'

export const OfferingServiceType = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM offering_service_type')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM offering_service_type WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name, description, image) {
    const [result] = await db.query(
      'INSERT INTO offering_service_type (name, description, image) VALUES (?,?)',
      [name, description, image]
    )
    return { id: result.insertId, name, image }
  },

  async update(id, name, description, image) {
    await db.query(
      'UPDATE offering_service_type SET name = ?, description = ?, image = ? WHERE id = ?',
      [name, id, description, image]
    )
    return { id, name, description, image }
  },

  async remove(id) {
    await db.query('DELETE FROM offering_service_type WHERE id = ?', [id])
    return {
      message: 'offering service type deleted successfully',
    }
  },
}
