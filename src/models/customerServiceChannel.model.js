import db from '../config/db.js'

export const CustomerServiceChannel = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM customer_service_channel')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM customer_service_channel WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name, description, image) {
    const [result] = await db.query(
      'INSERT INTO customer_service_channel (name, description, image) VALUES (?,?)',
      [name, description, image]
    )
    return { id: result.insertId, name, image }
  },

  async update(id, name, description, image) {
    await db.query(
      'UPDATE customer_service_channel SET name = ?, SET description = ?, SET image = ? WHERE id = ?',
      [name, id, description, image]
    )
    return { id, name, description, image }
  },

  async remove(id) {
    await db.query('DELETE FROM customer_service_channel WHERE id = ?', [id])
    return { message: 'Customer service channel deleted successfully' }
  },
}
