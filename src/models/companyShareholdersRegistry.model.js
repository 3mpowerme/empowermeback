import db from '../config/db.js'

export const CompanyShareholdersRegistry = {
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      'SELECT id, contact_email, contact_name, contact_phone FROM company_shareholders_registry_request WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(company_id, contact_name, contact_email, contact_phone) {
    const [result] = await db.query(
      `INSERT INTO company_shareholders_registry_request 
      (company_id, contact_name, contact_email, contact_phone)
      VALUES (?,?,?,?)`,
      [company_id, contact_name, contact_email, contact_phone]
    )
    const registryId = result.insertId
    return { id: registryId }
  },

  async update(id, company_id, contact_name, contact_email, contact_phone) {
    await db.query(
      `UPDATE company_shareholders_registry_request 
      SET contact_name=?, contact_email=?, contact_phone=? 
      WHERE company_id=?`,
      [contact_name, contact_email, contact_phone, company_id]
    )
    return { id }
  },
}
