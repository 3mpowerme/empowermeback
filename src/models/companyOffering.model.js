import db from '../config/db.js'

export const CompanyOffering = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM company_offering')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM company_offering WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(name, image) {
    const [result] = await db.query(
      'INSERT INTO company_offering (name, image) VALUES (?,?)',
      [name, image]
    )
    return { id: result.insertId, name, image }
  },

  async update(id, name, image) {
    await db.query(
      'UPDATE company_offering SET name = ?, SET image = ? WHERE id = ?',
      [name, id, image]
    )
    return { id, name, image }
  },

  async remove(id) {
    await db.query('DELETE FROM company_offering WHERE id = ?', [id])
    return { message: 'Company offering deleted successfully' }
  },
}
