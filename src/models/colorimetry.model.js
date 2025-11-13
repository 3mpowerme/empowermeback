import db from '../config/db.js'

export const Colorimetry = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM colorimetry')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM colorimetry WHERE id = ?', [
      id,
    ])
    return rows[0]
  },

  async create(
    color_1,
    color_2,
    color_3,
    color_4,
    color_5,
    color_6,
    colorimetry_name
  ) {
    const [result] = await db.query(
      'INSERT INTO colorimetry (color_1, color_2, color_3, color_4, color_5, color_6, name) VALUES (?,?,?,?,?,?,?)',
      [color_1, color_2, color_3, color_4, color_5, color_6, colorimetry_name]
    )
    return {
      id: result.insertId,
      color_1,
      color_2,
      color_3,
      color_4,
      color_5,
      color_6,
      colorimetry_name,
    }
  },

  async remove(id) {
    await db.query('DELETE FROM colorimetry WHERE id = ?', [id])
    return { message: 'Colorimetry deleted successfully' }
  },
}
