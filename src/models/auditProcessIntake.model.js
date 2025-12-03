import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const TABLE = 'audit_process_intakes'

const PASSWORD_FIELDS = [
  'company_sii_password',
  'legal_representative_sii_password',
]

async function hashPasswordFields(payload) {
  const result = { ...payload }
  for (const field of PASSWORD_FIELDS) {
    if (result[field]) {
      result[field] = await bcrypt.hash(result[field], 10)
    }
  }
  return result
}

export const AuditProcessIntakeModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE} ORDER BY created_at DESC`
    )
    return rows
  },

  async getById(company_id) {
    const [rows] = await db.query(
      `SELECT * FROM ${TABLE} WHERE company_id = ?`[company_id]
    )
    return rows[0]
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`,
      [id]
    )
    return rows[0] || null
  },

  async create(data) {
    const payload = await hashPasswordFields(data)
    const keys = Object.keys(payload).filter(
      (key) => payload[key] !== undefined
    )
    if (keys.length === 0) {
      const [result] = await pool.query(`INSERT INTO ${TABLE} () VALUES ()`)
      return { id: result.insertId }
    }
    const fields = keys.map((k) => `\`${k}\``).join(', ')
    const placeholders = keys.map(() => '?').join(', ')
    const values = keys.map((k) => payload[k])

    const [result] = await pool.query(
      `INSERT INTO ${TABLE} (${fields}) VALUES (${placeholders})`,
      values
    )
    return { id: result.insertId }
  },

  async update(id, data) {
    const payload = await hashPasswordFields(data)
    const keys = Object.keys(payload).filter(
      (key) => payload[key] !== undefined
    )
    if (keys.length === 0) {
      const existing = await this.findById(id)
      return existing
    }
    const setClause = keys.map((k) => `\`${k}\` = ?`).join(', ')
    const values = keys.map((k) => payload[k])
    values.push(id)

    const [result] = await pool.query(
      `UPDATE ${TABLE} SET ${setClause} WHERE id = ?`,
      values
    )

    if (result.affectedRows === 0) {
      return null
    }

    return this.findById(id)
  },
}
