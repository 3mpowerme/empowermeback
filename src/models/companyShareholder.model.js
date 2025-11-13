import db from '../config/db.js'

export const CompanyShareholder = {
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      'SELECT * FROM company_shareholders WHERE company_id = ?',
      [company_id]
    )
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM company_shareholders WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(
    company_id,
    full_name,
    rut,
    address,
    phone,
    profession,
    type,
    email,
    unique_key,
    nationality
  ) {
    const [result] = await db.query(
      `INSERT INTO company_shareholders 
      (company_id, full_name, rut, address, phone, profession, type, email, unique_key, nationality) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        company_id,
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality,
      ]
    )
    return { id: result.insertId }
  },

  async update(
    id,
    company_id,
    full_name,
    rut,
    address,
    phone,
    profession,
    type,
    email,
    unique_key,
    nationality
  ) {
    await db.query(
      `UPDATE company_shareholders 
      SET company_id = ?, full_name = ?, rut = ?, address = ?, phone = ?, profession = ?, type = ?, email = ?, unique_key = ?, nationality = ?
      WHERE id = ?`,
      [
        company_id,
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality,
        id,
      ]
    )
    return { id }
  },

  async delete(id) {
    await db.query('DELETE FROM company_shareholders WHERE id = ?', [id])
    return { id }
  },
}
