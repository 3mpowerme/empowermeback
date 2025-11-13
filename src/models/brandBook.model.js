import db from '../config/db.js'

export const BrandBook = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM brand_book')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM brand_book as b left join colorimetry c on b.colorimetry_id = c.id left join logo l on b.logo_id=l.id WHERE b.id = ?',
      [id]
    )
    return rows[0]
  },

  async create(brand_name, slogan, colorimetry_id) {
    const [result] = await db.query(
      'INSERT brand_book (brand_name, slogan, colorimetry_id) VALUES (?,?,?)',
      [brand_name, slogan, colorimetry_id]
    )
    return { id: result.insertId }
  },

  async updateLogoId(id, logo_id) {
    await db.query('UPDATE brand_book SET logo_id = ? WHERE id = ?', [
      logo_id,
      id,
    ])
    return { id, logo_id }
  },

  async remove(id) {
    await db.query('DELETE FROM brand_book WHERE id = ?', [id])
    return { message: 'Brand book deleted successfully' }
  },
}
