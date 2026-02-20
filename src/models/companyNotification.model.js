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

  static async findByUser(id, onlyUnread = false, limit = 50, offset = 0) {
    let query = `
      SELECT *
      FROM company_notifications
      WHERE user_id = ?
    `
    const params = [id]

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

  static async markAsRead({ id, userId = null, companyId = null }) {
    if (!id) throw new Error('id is required')
    if (!userId && !companyId)
      throw new Error('userId or companyId is required')
    if (userId && companyId)
      throw new Error('provide only one: userId or companyId')

    const conditions = ['id = ?']
    const values = [id]

    if (userId) {
      conditions.push('user_id = ?')
      values.push(userId)
    }

    if (companyId) {
      conditions.push('company_id = ?')
      values.push(companyId)
    }

    const [result] = await pool.query(
      `UPDATE company_notifications
     SET is_read = 1, read_at = NOW()
     WHERE ${conditions.join(' AND ')}`,
      values
    )

    return result.affectedRows > 0
  }

  static async markAllAsRead({ userId = null, companyId = null }) {
    if (!userId && !companyId)
      throw new Error('userId or companyId is required')
    if (userId && companyId)
      throw new Error('provide only one: userId or companyId')

    const conditions = ['is_read = 0']
    const values = []

    if (userId) {
      conditions.push('user_id = ?')
      values.push(userId)
    }

    if (companyId) {
      conditions.push('company_id = ?')
      values.push(companyId)
    }

    const [result] = await pool.query(
      `UPDATE company_notifications
     SET is_read = 1, read_at = NOW()
     WHERE ${conditions.join(' AND ')}`,
      values
    )

    return result.affectedRows
  }
}
