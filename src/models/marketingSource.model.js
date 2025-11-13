import db from '../config/db.js'

export const MarketingSource = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM marketing_source')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM marketing_source WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name, image) {
    const [result] = await db.query(
      'INSERT INTO marketing_source (name, image) VALUES (?,?)',
      [name, image]
    )
    return { id: result.insertId, name, image }
  },

  async update(id, name, image) {
    await db.query(
      'UPDATE marketing_source SET name = ?, SET image = ? WHERE id = ?',
      [name, id, image]
    )
    return { id, name, image }
  },

  async remove(id) {
    await db.query('DELETE FROM marketing_source WHERE id = ?', [id])
    return { message: 'Marketing source deleted successfully' }
  },
}
