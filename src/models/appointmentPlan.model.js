import db from '../config/db.js'

export const AppointmentPlan = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM appointment_plan')
    return rows
  },

  async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM appointment_plan WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async create(title, description, price, include, calendly_event_type) {
    const [result] = await db.query(
      'INSERT INTO appointment_plan (title, description, price, include, calendly_event_type) VALUES (?,?,?,?,?)',
      [title, description, price, include, calendly_event_type]
    )
    return {
      id: result.insertId,
      title,
      description,
      price,
      include,
      calendly_event_type,
    }
  },

  async update(id, title, description, price, include, calendly_event_type) {
    await db.query(
      'UPDATE appointment_plan SET title = ?, description = ?, price = ?, include = ?, calendly_event_type = ?  WHERE id = ?',
      [title, description, price, include, calendly_event_type, id]
    )
    return { id, title, description, price, include, calendly_event_type }
  },

  async remove(id) {
    await db.query('DELETE FROM plan WHERE id = ?', [id])
    return { message: 'Plan deleted successfully' }
  },
}
