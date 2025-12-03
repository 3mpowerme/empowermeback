import db from '../config/db.js'

export const CompanyMonthlyAccountingRequest = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT need_startup_support, appointment_date, status FROM company_monthly_accounting_request WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },
  async getCommercialMovementsById(company_id) {
    const [rows] = await db.query(
      'SELECT movement_id FROM company_commercial_movements as cc, commercial_movements as cm WHERE cc.company_id = ? AND cc.movement_id = cm.id',
      [company_id]
    )
    return rows[0]
  },
  async create(
    company_id,
    email,
    company_contact_phone,
    legal_representative_name,
    legal_representative_rut,
    legal_representative_phone,
    need_startup_support,
    commercial_movements,
    service_id
  ) {
    const [result] = await db.query(
      'INSERT INTO company_monthly_accounting_request (company_id, email, company_contact_phone, legal_representative_name, legal_representative_rut, legal_representative_phone,need_startup_support, service_id) VALUES (?,?,?,?,?,?,?,?)',
      [
        company_id,
        email,
        company_contact_phone,
        legal_representative_name,
        legal_representative_rut,
        legal_representative_phone,
        need_startup_support,
        service_id,
      ]
    )
    const values = commercial_movements.map((commercial_movement_id) => [
      company_id,
      commercial_movement_id,
    ])
    await db.query(
      `INSERT INTO company_commercial_movements (company_id, movement_id) VALUES ?`,
      [values]
    )
    return {
      id: result.insertId,
    }
  },
  async update(company_id, need_startup_support, commercial_movements) {
    await db.query(
      'UPDATE company_monthly_accounting_request SET need_startup_support = ? WHERE company_id = ?',
      [need_startup_support, company_id]
    )
    // TODO update for the other table
    return {
      company_id,
    }
  },
}
