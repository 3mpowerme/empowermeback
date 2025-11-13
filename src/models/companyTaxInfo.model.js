import db from '../config/db.js'

export const CompanyTaxInfo = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT business_name, email, phone, rut, address, password, previred_password, mutual_password FROM company_tax_info WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(
    company_id,
    business_name,
    email,
    phone,
    rut,
    address,
    password,
    previred_password,
    mutual_password
  ) {
    const [result] = await db.query(
      `INSERT INTO company_tax_info 
       (company_id, business_name, email, phone, rut, address, password, previred_password, mutual_password) 
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        company_id,
        business_name,
        email,
        phone,
        rut,
        address,
        password,
        previred_password,
        mutual_password,
      ]
    )
    return { id: result.insertId }
  },

  async update(
    company_id,
    business_name,
    email,
    phone,
    rut,
    address,
    password,
    previred_password,
    mutual_password
  ) {
    await db.query(
      `UPDATE company_tax_info 
       SET business_name = ?, email = ?, phone = ?, rut = ?, address = ?, password = ?, previred_password = ?, mutual_password = ?
       WHERE company_id = ?`,
      [
        business_name,
        email,
        phone,
        rut,
        address,
        password,
        previred_password,
        mutual_password,
        company_id,
      ]
    )
    return { company_id }
  },
}
