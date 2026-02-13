import db from '../config/db.js'

export const Country = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM countries')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM countries WHERE id = ?', [id])
    return rows[0]
  },

  async getByCode(code) {
    const [rows] = await db.query('SELECT * FROM countries WHERE code = ?', [
      code,
    ])
    return rows?.[0]
  },

  async getNameById(id) {
    const [rows] = await db.query('SELECT name FROM countries WHERE id = ?', [
      id,
    ])
    return rows[0]
  },

  async create(name, code) {
    const [result] = await db.query(
      'INSERT INTO countries (name, code) VALUES (?,?)',
      [name, code]
    )
    return { id: result.insertId, name, code }
  },

  async remove(id) {
    await db.query('DELETE FROM countries WHERE id = ?', [id])
    return { message: 'Country deleted successfully' }
  },
}
