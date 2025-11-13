import db from '../config/db.js'

export const ServiceRequest = {
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      'SELECT s.id, s.service_type, s.contact_email, s.contact_name, s.contact_phone, s.created_at, s.status FROM service_request s WHERE company_id = ?',
      [company_id]
    )
    return rows
  },
  async getWithAppointMentByCompanyId(company_id) {
    const [rows] = await db.query(
      'SELECT s.id, s.service_type, s.contact_email, s.contact_name, s.contact_phone, s.created_at, s.status, a.scheduled_date, a.status as appointment_status FROM service_request s, appointment a  WHERE company_id = ? AND s.id = a.service_request_id',
      [company_id]
    )
    return rows
  },

  async create(
    company_id,
    service_id,
    contact_name,
    contact_email,
    contact_phone
  ) {
    const [result] = await db.query(
      `INSERT INTO service_contact_info 
      (company_id, service_id, contact_name, contact_email, contact_phone)
      VALUES (?,?,?,?,?)`,
      [company_id, service_id, contact_name, contact_email, contact_phone]
    )
    const reviewId = result.insertId
    return { id: reviewId }
  },

  async update(
    company_id,
    contact_name,
    contact_email,
    contact_phone,
    service_type
  ) {
    /*
    await db.query(
      `UPDATE service_contact_info 
      SET contact_name=?, contact_email=?, contact_phone=?
      WHERE company_id=?`,
      [contact_name, contact_email, contact_phone, company_id]
    )
      */
    return { id }
  },

  async updateStatus(id, status) {
    return { id }
  },
}
