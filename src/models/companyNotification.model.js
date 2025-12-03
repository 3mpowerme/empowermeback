import pool from '../config/db.js'

export class CompanyNotification {
  static async create(companyId, title, message, type = null, metadata = null) {
    const [result] = await pool.query(
      `INSERT INTO company_notifications (company_id, title, message, type, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [
        companyId,
        title,
        message,
        type,
        metadata ? JSON.stringify(metadata) : null,
      ]
    )
    return this.getById(result.insertId)
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT *
       FROM company_notifications
       WHERE id = ?`,
      [id]
    )
    if (!rows.length) return null
    const row = rows[0]
    return {
      ...row,
      metadata:
        typeof row.metadata === 'string'
          ? JSON.parse(row.metadata)
          : row.metadata,
    }
  }

  static async findByCompany(
    companyId,
    onlyUnread = false,
    limit = 50,
    offset = 0
  ) {
    let query = `
      SELECT *
      FROM company_notifications
      WHERE company_id = ?
    `
    const params = [companyId]

    if (onlyUnread) query += ' AND is_read = 0'

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.query(query, params)
    return rows.map((r) => {
      console.log('r.metadata', r.metadata)
      console.log('typeof ', typeof r.metadata)
      return {
        ...r,
        metadata:
          typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata,
      }
    })
  }

  static async markAsRead(id, companyId) {
    try {
      const [result] = await pool.query(
        `UPDATE company_notifications
       SET is_read = 1, read_at = NOW()
       WHERE id = ? AND company_id = ?`,
        [id, companyId]
      )
      return result.affectedRows > 0
    } catch (error) {
      console.error(error)
    }
  }

  static async markAllAsRead(companyId) {
    const [result] = await pool.query(
      `UPDATE company_notifications
       SET is_read = 1, read_at = NOW()
       WHERE company_id = ? AND is_read = 0`,
      [companyId]
    )
    return result.affectedRows
  }
}
