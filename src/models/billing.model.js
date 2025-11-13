import db from '../config/db.js'

export const Billing = {
  async getCompanyOwnerEmail(companyId) {
    const [[row]] = await db.query(
      `SELECT u.email
       FROM companies c
       JOIN users u ON u.id = c.owner_user_id
       WHERE c.id = ? LIMIT 1`,
      [companyId]
    )
    return row?.email || null
  },

  async getOrCreateStripeCustomerId(companyId, email, stripe) {
    const [[bc]] = await db.query(
      `SELECT external_customer_id FROM billing_customer WHERE company_id = ? AND provider = 'stripe' LIMIT 1`,
      [companyId]
    )
    if (bc?.external_customer_id) return bc.external_customer_id

    const customer = await stripe.customers.create({
      email,
      metadata: { company_id: String(companyId) },
    })
    await db.query(
      `INSERT INTO billing_customer (company_id, provider, external_customer_id)
       VALUES (?, 'stripe', ?)`,
      [companyId, customer.id]
    )
    return customer.id
  },

  async getServiceOrder(serviceOrderId) {
    const [[row]] = await db.query(
      `SELECT so.*, s.code AS service_code
       FROM service_orders so
       JOIN services s ON s.id = so.service_id
       WHERE so.id = ? LIMIT 1`,
      [serviceOrderId]
    )
    return row || null
  },

  async createServiceOrder(
    companyId,
    serviceId,
    amountCents,
    currency,
    requestedByUserId = null,
    title = null,
    description = null
  ) {
    if (!companyId || !serviceId)
      throw new Error('companyId and serviceId are required')
    if (!amountCents || !currency)
      throw new Error('amountCents and currency are required')

    const [result] = await db.query(
      `
      INSERT INTO service_orders
        (company_id, requested_by_user_id, service_id, title, description, currency, amount_cents, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, 'pending_payment')
      `,
      [
        companyId,
        requestedByUserId,
        serviceId,
        title,
        description,
        String(currency).toUpperCase(),
        amountCents,
      ]
    )

    const insertId = result.insertId

    const [[row]] = await db.query(
      `
      SELECT so.*, s.code AS service_code
      FROM service_orders so
      JOIN services s ON s.id = so.service_id
      WHERE so.id = ?
      LIMIT 1
      `,
      [insertId]
    )

    return row
  },

  async markServiceOrderPaid(serviceOrderId) {
    await db.query(`UPDATE service_orders SET status = 'paid' WHERE id = ?`, [
      serviceOrderId,
    ])
  },
}
