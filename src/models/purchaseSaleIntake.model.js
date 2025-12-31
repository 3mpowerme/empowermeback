import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const TABLE = 'purchase_sale_intakes'

const PASSWORD_FIELDS = ['seller_rut_unique_key']

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

  if (payload.shareholders !== undefined) {
    if (payload.shareholders === null) {
      payload.shareholders = null
    } else {
      payload.shareholders = JSON.stringify(payload.shareholders || [])
    }
  }

  return payload
}

export const PurchaseSaleIntakeModel = {
  async create(data) {
    let payload = normalizePayload(data)
    payload = await hashPasswordFields(payload)

    const keys = Object.keys(payload).filter((k) => payload[k] !== undefined)

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
}
