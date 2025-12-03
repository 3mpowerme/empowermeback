import db from '../config/db.js'

export const CompanyMonthlyAccountingRequiredDocuments = {
  async getById(company_id) {
    const [rows] = await db.query(
      'SELECT * FROM company_monthly_accounting_required_documents WHERE company_id = ?',
      [company_id]
    )
    return rows[0]
  },

  async create(
    company_id,
    service_id,
    company_rut,
    company_statute_or_constitution,
    proof_of_address,
    legal_representative_rut,
    legal_representative_key,
    activities
  ) {
    try {
      const [result] = await db.query(
        'INSERT INTO company_monthly_accounting_required_documents (company_id, service_id, company_rut, company_statute_or_constitution, proof_of_address, legal_representative_rut, legal_representative_key, activities) VALUES (?,?,?,?,?,?,?,?)',
        [
          company_id,
          service_id,
          company_rut,
          company_statute_or_constitution,
          proof_of_address,
          legal_representative_rut,
          legal_representative_key,
          JSON.stringify(activities),
        ]
      )
      return {
        id: result.insertId,
      }
    } catch (err) {
      console.error('error', err)
    }
  },
  async update(company_id, need_startup_support, commercial_movements) {
    // TODO
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
