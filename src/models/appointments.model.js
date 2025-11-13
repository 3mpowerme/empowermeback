import db from '../config/db.js'

export const Appointments = {
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      'SELECT s.id, s.service_type, s.contact_email, s.contact_name, s.contact_phone, s.created_at, s.status, a.scheduled_date, a.status as appointment_status FROM service_request s, appointment a  WHERE company_id = ? AND s.id = a.service_request_id',
      [company_id]
    )
    return rows
  },

  async getServiceOrderByScheduledEventUri(scheduledEventUri) {
    const [row] = await db.query(
      'select service_order_id from appointments where scheduled_event_uri = ?',
      [scheduledEventUri]
    )
    return row || null
  },

  async create(
    serviceOrderId,
    email,
    name,
    scheduled_event_start_time,
    scheduled_event_end_time,
    scheduled_event_uri,
    cancel_url,
    reschedule_url
  ) {
    const [result] = await db.query(
      `INSERT INTO appointments 
      (service_order_id, email, name, scheduled_event_start_time, scheduled_event_end_time, scheduled_event_uri, cancel_url, reschedule_url)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        serviceOrderId,
        email,
        name,
        scheduled_event_start_time,
        scheduled_event_end_time,
        scheduled_event_uri,
        cancel_url,
        reschedule_url,
      ]
    )
    const reviewId = result.insertId
    return { id: reviewId }
  },

  async updateStatusByScheduledEventUri(scheduled_event_uri, status) {
    await db.query(
      `UPDATE appointments 
      SET status=?
      WHERE scheduled_event_uri=?`,
      [status, scheduled_event_uri]
    )
    return { scheduled_event_uri }
  },

  async updateDatesByScheduledEventUri(
    scheduled_event_uri,
    scheduled_event_start_time,
    scheduled_event_end_time
  ) {
    await db.query(
      `UPDATE appointments 
      SET scheduled_event_start_time=?, scheduled_event_end_time=?
      WHERE scheduled_event_uri=?`,
      [
        scheduled_event_start_time,
        scheduled_event_end_time,
        scheduled_event_uri,
      ]
    )
    return { scheduled_event_uri }
  },
}
