import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const TABLE = 'accounting_client_intakes'

const PASSWORD_FIELDS = [
  'company_sii_password',
  'previred_credentials',
  'mutual_credentials',
  'medical_leave_credentials',
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

function normalizePayload(data) {
  const payload = { ...data }

  if (payload.company_contact_phone !== undefined) {
    if (payload.company_contact_phone === null) {
      payload.company_contact_phone = null
    } else {
      payload.company_contact_phone = JSON.stringify(
        payload.company_contact_phone || {}
      )
    }
  }

  if (payload.legal_representative_phone !== undefined) {
    if (payload.legal_representative_phone === null) {
      payload.legal_representative_phone = null
    } else {
      payload.legal_representative_phone = JSON.stringify(
        payload.legal_representative_phone || {}
      )
    }
  }

  return payload
}

export const AccountingClientIntakeModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM ${TABLE} ORDER BY created_at DESC`
    )
    return rows
  },

  async getById(company_id) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM ${TABLE} WHERE company_id = ?`,
        [company_id]
      )
      console.log('rows', rows)
      return rows[0]
    } catch (error) {
      console.error(error)
    }
  },

  async getCommercialMovementsById(company_id) {
    const [rows] = await pool.query(
      'SELECT movement_id FROM company_commercial_movements as cc, commercial_movements as cm WHERE cc.company_id = ? AND cc.movement_id = cm.id',
      [company_id]
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

  async create(data, company_id) {
    /**
     * Commercial movements insert
     */
    const { commercial_movements } = data
    const commercial_movements_values = commercial_movements.map(
      (commercial_movement_id) => [company_id, commercial_movement_id]
    )
    await pool.query(
      `INSERT INTO company_commercial_movements (company_id, movement_id) VALUES ?`,
      [commercial_movements_values]
    )
    delete data.commercial_movements
    /**
     * Commercial movements insert end
     */

    const payload = await hashPasswordFields(normalizePayload(data))

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
