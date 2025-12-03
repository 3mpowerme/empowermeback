import db from '../config/db.js'

export const CompanyDocument = {
  async findByCompany(companyId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT 
        id,
        company_id,
        name,
        storage_key,
        mime_type,
        size_bytes,
        uploaded_by_user_id,
        created_at,
        updated_at
      FROM company_documents
      WHERE company_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [companyId, limit, offset]
    )
    return rows
  },

  async getById(id, companyId) {
    const [rows] = await db.query(
      `SELECT 
        id,
        company_id,
        name,
        storage_key,
        mime_type,
        size_bytes,
        uploaded_by_user_id,
        created_at,
        updated_at
      FROM company_documents
      WHERE id = ? AND company_id = ?
      LIMIT 1`,
      [id, companyId]
    )
    return rows[0] || null
  },
}
