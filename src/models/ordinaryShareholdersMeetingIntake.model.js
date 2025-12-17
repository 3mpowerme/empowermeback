import pool from '../config/db.js'

const TABLE = 'ordinary_shareholders_meeting_intakes '

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

export const OrdinaryShareholdersMeetingIntakeModel = {
  async create(data) {
    const payload = normalizePayload(data)
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
}
