import pool from '../config/db.js'

const TABLE = 'constitution_review_intakes'

function normalizePayload(data) {
  const payload = { ...data }

  if (payload.shareholders !== undefined) {
    if (payload.shareholders === null) {
      payload.shareholders = null
    } else {
      payload.shareholders = JSON.stringify(payload.shareholders || [])
    }
  }

  if (payload.legal_representatives !== undefined) {
    if (payload.legal_representatives === null) {
      payload.legal_representatives = null
    } else {
      payload.legal_representatives = JSON.stringify(
        payload.legal_representatives || []
      )
    }
  }

  if (payload.contact_person_phone !== undefined) {
    if (payload.contact_person_phone === null) {
      payload.contact_person_phone = null
    } else {
      payload.contact_person_phone = JSON.stringify(
        payload.contact_person_phone || {}
      )
    }
  }

  return payload
}

export const ConstitutionReviewIntakeModel = {
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
