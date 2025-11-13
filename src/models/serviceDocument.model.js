import db from '../config/db.js'

export const ServiceDocument = {
  async listByService(serviceId) {
    const [rows] = await db.query(
      `SELECT id, service_id, name, details, doc_type, max_size_bytes, url, notes, created_at, updated_at
       FROM service_documents
       WHERE service_id = ?
       ORDER BY id DESC`,
      [serviceId]
    )
    return rows
  },

  async getById(id, serviceId) {
    const [[row]] = await db.query(
      `SELECT id, service_id, name, details, doc_type, max_size_bytes, url, notes, created_at, updated_at
       FROM service_documents
       WHERE id = ? AND service_id = ? LIMIT 1`,
      [id, serviceId]
    )
    return row || null
  },

  async create({
    service_id,
    name,
    details,
    doc_type,
    max_size_bytes,
    url,
    notes,
  }) {
    const [res] = await db.query(
      `INSERT INTO service_documents
       (service_id, name, details, doc_type, max_size_bytes, url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        service_id,
        name,
        details || null,
        doc_type,
        max_size_bytes,
        url || null,
        notes || null,
      ]
    )
    return await this.getById(res.insertId, service_id)
  },

  async update(id, service_id, payload) {
    const fields = []
    const values = []
    for (const [k, v] of Object.entries(payload)) {
      fields.push(`${k} = ?`)
      values.push(v)
    }
    if (!fields.length) return await this.getById(id, service_id)

    values.push(id, service_id)
    await db.query(
      `UPDATE service_documents SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND service_id = ?`,
      values
    )
    return await this.getById(id, service_id)
  },

  async updateFields(id, service_id, fields) {
    if (!fields || Object.keys(fields).length === 0) return null

    const sets = []
    const values = []

    for (const [key, val] of Object.entries(fields)) {
      sets.push(`${key} = ?`)
      values.push(val)
    }

    sets.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id, service_id)

    await db.query(
      `UPDATE service_documents SET ${sets.join(', ')} WHERE id = ? AND service_id = ?`,
      values
    )

    const [[row]] = await db.query(
      `SELECT id, service_id, name, details, doc_type, max_size_bytes, url, notes, created_at, updated_at
       FROM service_documents
       WHERE id = ? AND service_id = ?`,
      [id, service_id]
    )

    return row || null
  },

  async remove(id, service_id) {
    const [res] = await db.query(
      `DELETE FROM service_documents WHERE id = ? AND service_id = ?`,
      [id, service_id]
    )
    return res.affectedRows > 0
  },

  async serviceExists(serviceId) {
    const [[row]] = await db.query(
      `SELECT id FROM services WHERE id = ? AND is_active = 1 LIMIT 1`,
      [serviceId]
    )
    return !!row
  },
}
