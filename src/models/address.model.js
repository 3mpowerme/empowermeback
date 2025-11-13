import db from '../config/db.js'

export const Address = {
  async create(street, zip_code, phone_number, region_id) {
    const [result] = await db.query(
      'INSERT INTO address (street, zip_code, phone_number, region_id) VALUES (?,?,?,?)',
      [street, zip_code, phone_number, region_id]
    )
    return { id: result.insertId, street, zip_code, phone_number, region_id }
  },
}
