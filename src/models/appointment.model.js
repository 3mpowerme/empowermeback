import db from '../config/db.js'

export const Appointment = {
  async getByCompanyId(company_id) {
    const [rows] = await db.query(
      `SELECT
        so.id                                AS service_order_id,
        so.company_id,
        so.service_id,
        so.title,
        so.description,
        so.currency,
        so.amount_cents                      AS service_order_amount_cents,
        so.status                            AS service_order_status,
        so.created_at                        AS service_order_created_at,

        s.code                               AS service_code,
        s.name                               AS service_name,
        s.description                        AS service_description,
        s.default_currency,
        s.default_amount_cents,
        s.calendly_event_type,

        p.id                                 AS payment_id,
        p.status                             AS payment_status,
        p.provider                           AS payment_provider,
        p.amount_cents                       AS payment_amount_cents,
        p.currency                           AS payment_currency,
        p.external_payment_intent_id,
        p.external_invoice_id,
        p.external_charge_id,
        p.created_at                         AS payment_created_at,

        a.id                                 AS appointment_id,
        a.name                               AS appointment_name,
        a.email                              AS appointment_email,
        a.scheduled_event_start_time,
        a.scheduled_event_end_time,
        a.scheduled_event_uri,
        a.cancel_url,
        a.reschedule_url,
        a.status                             AS appointment_status,
        a.created_at                         AS appointment_created_at

      FROM service_orders so
      LEFT JOIN services s
        ON s.id = so.service_id
      LEFT JOIN payments p
        ON p.service_order_id = so.id
        AND p.type = 'service_order'
      LEFT JOIN appointments a
        ON a.service_order_id = so.id
      WHERE so.company_id = ?
      ORDER BY so.created_at DESC`,
      [company_id]
    )
    return rows
  },

  async create(service_request_id, calendly_event_uri, scheduled_date, status) {
    const [result] = await db.query(
      `INSERT INTO appointment 
      (service_request_id, calendly_event_uri, scheduled_date, status)
      VALUES (?,?,?,?)`,
      [service_request_id, calendly_event_uri, scheduled_date, status]
    )
    const reviewId = result.insertId
    return { id: reviewId }
  },

  async updateStatus(id, status) {
    await db.query(
      `UPDATE appointment 
      SET status=?
      WHERE id=?`,
      [status, id]
    )
    return { id }
  },

  async updateScheduledDate(id, scheduled_date) {
    await db.query(
      `UPDATE appointment 
      SET scheduled_date=?
      WHERE id=?`,
      [scheduled_date, id]
    )
    return { id }
  },
}
