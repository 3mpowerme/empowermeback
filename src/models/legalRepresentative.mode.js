import db from '../config/db.js'

export const LegalRepresentative = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT  name, rut, phone, password FROM company_legal_representative WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(company_id, name, rut, phone, password) {
    const [result] = await db.query(
      `INSERT INTO company_legal_representative 
       (company_id, name, rut, phone, password) 
       VALUES (?,?,?,?,?)`,
      [company_id, name, rut, phone, password]
    )
    return { id: result.insertId }
  },

  async update(company_id, name, rut, phone, password) {
    await db.query(
      `UPDATE company_legal_representative SET name = ?, rut = ?, phone = ?, password = ? WHERE company_id = ?`,
      [name, rut, phone, password, company_id]
    )
    return { company_id }
  },
}
