import db from '../config/db.js'

export const Address = {
  async get(id) {
    const [[result]] = await db.query(
      'SELECT street, zip_code, phone_number, region_id from address where id=?',
      [id]
    )
    if (result.phone_number) {
      result.phone_number = JSON.parse(result.phone_number)
    }
    return result
  },
  async create(street, zip_code, phone_number, region_id) {
    const [result] = await db.query(
      'INSERT INTO address (street, zip_code, phone_number, region_id) VALUES (?,?,?,?)',
      [street, zip_code, JSON.stringify(phone_number), region_id]
    )
    return { id: result.insertId, street, zip_code, phone_number, region_id }
  },
  async update(street, zip_code, phone_number, region_id, address_id) {
    const [result] = await db.query(
      'UPDATE address set street=?, zip_code=?, phone_number=?, region_id=? where id=?',
      [street, zip_code, JSON.stringify(phone_number), region_id, address_id]
    )
    return { id: result.insertId, street, zip_code, phone_number, region_id }
  },
}
