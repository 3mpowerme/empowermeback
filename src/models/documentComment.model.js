import db from '../config/db.js'

export const DocumentComment = {
  async findByDocument(documentId, companyId, limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT
        id,
        document_id,
        company_id,
        created_by_user_id,
        comment,
        created_at
      FROM document_comments
      WHERE document_id = ? AND company_id = ?
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?`,
      [documentId, companyId, limit, offset]
    )
    return rows
  },

  async create(documentId, companyId, userId, comment) {
    const [result] = await db.query(
      `INSERT INTO document_comments (
        document_id,
        company_id,
        created_by_user_id,
        comment
      ) VALUES (?, ?, ?, ?)`,
      [documentId, companyId, userId, comment]
    )

    const [rows] = await db.query(
      `SELECT
        id,
        document_id,
        company_id,
        created_by_user_id,
        comment,
        created_at
      FROM document_comments
      WHERE id = ?
      LIMIT 1`,
      [result.insertId]
    )

    return rows[0] || null
  },
}
