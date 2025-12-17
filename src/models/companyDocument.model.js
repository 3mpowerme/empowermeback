import db from '../config/db.js'

export const CompanyDocument = {
  async findByCompany(companyId, serviceId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `
      SELECT id, company_id, service_id, name, storage_key, mime_type, size_bytes, uploaded_by_user_id, created_at, updated_at
      FROM company_documents
      WHERE company_id = ? AND service_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [companyId, serviceId, Number(limit), Number(offset)]
    )
    return rows
  },

  async getById(id, companyId, serviceId) {
    if (serviceId) {
      const [rows] = await db.query(
        `
        SELECT id, company_id, service_id, name, storage_key, mime_type, size_bytes, uploaded_by_user_id, created_at, updated_at
        FROM company_documents
        WHERE id = ? AND company_id = ? AND service_id = ?
        LIMIT 1
        `,
        [Number(id), Number(companyId), Number(serviceId)]
      )
      return rows[0] || null
    }

    const [rows] = await db.query(
      `
      SELECT id, company_id, service_id, name, storage_key, mime_type, size_bytes, uploaded_by_user_id, created_at, updated_at
      FROM company_documents
      WHERE id = ? AND company_id = ?
      LIMIT 1
      `,
      [Number(id), Number(companyId)]
    )
    return rows[0] || null
  },

  async create(payload) {
    const {
      company_id,
      service_id,
      name,
      storage_key,
      mime_type,
      size_bytes,
      uploaded_by_user_id,
    } = payload

    const [result] = await db.query(
      `
      INSERT INTO company_documents
      (company_id, service_id, name, storage_key, mime_type, size_bytes, uploaded_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(company_id),
        Number(service_id),
        String(name),
        String(storage_key),
        mime_type ? String(mime_type) : null,
        size_bytes !== undefined && size_bytes !== null
          ? Number(size_bytes)
          : null,
        Number(uploaded_by_user_id),
      ]
    )

    const [rows] = await db.query(
      `
      SELECT id, company_id, service_id, name, storage_key, mime_type, size_bytes, uploaded_by_user_id, created_at, updated_at
      FROM company_documents
      WHERE id = ?
      LIMIT 1
      `,
      [result.insertId]
    )

    return rows[0]
  },
}
