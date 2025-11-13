import db from '../config/db.js'

export const CompanyDissolutionOfSpa = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT id, contact_email, contact_name, contact_phone FROM company_dissolution_of_spa_request WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(company_id, contact_name, contact_email, contact_phone) {
    const [result] = await db.query(
      `INSERT INTO company_dissolution_of_spa_request 
      (company_id, contact_name, contact_email, contact_phone)
      VALUES (?,?,?,?)`,
      [company_id, contact_name, contact_email, contact_phone]
    )
    const reviewId = result.insertId
    return { id: reviewId }
  },

  async update(company_id, contact_name, contact_email, contact_phone) {
    await db.query(
      `UPDATE company_dissolution_of_spa_request 
      SET contact_name=?, contact_email=?, contact_phone=? 
      WHERE company_id=?`,
      [contact_name, contact_email, contact_phone, company_id]
    )
    return { id }
  },
}
