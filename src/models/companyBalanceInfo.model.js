import db from '../config/db.js'

export const CompanyBalanceInfo = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT * FROM company_balance_request WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(company_id, contact_name, contact_email, contact_phone) {
    const [result] = await db.query(
      `INSERT INTO company_balance_request 
       (company_id, contact_name, contact_email, contact_phone) 
       VALUES (?,?,?,?)`,
      [company_id, contact_name, contact_email, contact_phone]
    )
    return { id: result.insertId }
  },

  async update(company_id, contact_name, contact_email, contact_phone) {
    await db.query(
      `UPDATE company_balance_request 
       SET contact_name = ?, contact_email = ?, contact_phone = ?
       WHERE company_id = ?`,
      [contact_name, contact_email, contact_phone, company_id]
    )
    return { company_id }
  },
}
