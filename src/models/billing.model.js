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
    // TODO support case when no company_id when a user without company pays conceptualization we should add user_id on billing_customers
    const [[bc]] = await db.query(
      `
      SELECT *
      FROM billing_customers
      WHERE company_id = ?
      LIMIT 1
      `,
      [companyId]
    )

    if (bc && bc.provider === 'stripe' && bc.external_customer_id) {
      return bc.external_customer_id
    }

    const customer = await stripe.customers.create({
      email,
      metadata: { company_id: String(companyId) },
    })

    if (bc) {
      await db.query(
        `UPDATE billing_customers
         SET provider = 'stripe',
             external_customer_id = ?
         WHERE id = ?`,
        [customer.id, bc.id]
      )
    } else {
      await db.query(
        `
        INSERT INTO billing_customers
          (company_id, provider, external_customer_id)
        VALUES
          (?, 'stripe', ?)
        `,
        [companyId, customer.id]
      )
    }

    return customer.id
  },

  async getServiceOrder(serviceOrderId) {
    const [[row]] = await db.query(
      `
      SELECT
        so.*,
        s.code AS service_code
      FROM service_orders so
      JOIN services s ON s.id = so.service_id
      WHERE so.id = ? LIMIT 1`,
      [serviceOrderId]
    )
    return row || null
  },

  async getServiceOrderByServiceCode(serviceCode, companyId) {
    const [row] = await db.query(
      `
      SELECT
        so.*,
        s.code AS service_code
      FROM service_orders so
      JOIN services s ON s.id = so.service_id
      WHERE s.code = ? AND so.payment_status = 'paid' AND company_id=? LIMIT 1`,
      [serviceCode, companyId]
    )
    return row
  },

  async createServiceOrder(
    companyId,
    serviceId,
    amountCents,
    currency,
    requestedByUserId = null,
    count = 1,
    subscriptionId = null,
    billingType = 'one_off'
  ) {
    if (!serviceId) throw new Error('serviceId are required')

    const [result] = await db.query(
      `
      INSERT INTO service_orders
        (company_id, requested_by_user_id, service_id, currency, amount_cents, payment_status, count, subscription_id, billing_type)
      VALUES
        (?, ?, ?, ?, ?, 'pending_payment', ?, ?, ?)
      `,
      [
        companyId,
        requestedByUserId,
        serviceId,
        currency ? String(currency).toUpperCase() : null,
        amountCents,
        count,
        subscriptionId,
        billingType,
      ]
    )

    const insertId = result.insertId

    const [[row]] = await db.query(
      `
      SELECT
        so.*,
        s.code AS service_code
      FROM service_orders so
      JOIN services s ON s.id = so.service_id
      WHERE so.id = ?
      LIMIT 1
      `,
      [insertId]
    )

    return row
  },

  async createServiceOrderWithItems(
    companyId,
    serviceId,
    baseAmountCents,
    currency,
    items = [],
    requestedByUserId = null
  ) {
    if (!companyId || !serviceId)
      throw new Error('companyId and serviceId are required')
    if (!baseAmountCents || !currency)
      throw new Error('baseAmountCents and currency are required')

    const normalizedCurrency = String(currency).toUpperCase()

    let totalAmountCents = baseAmountCents
    const addonLines = []

    if (Array.isArray(items)) {
      items.forEach((item) => {
        const quantity = Number(item.quantity) || 1
        const unitAmountCents = Number(item.unitAmountCents)
        if (!unitAmountCents) {
          throw new Error('unitAmountCents is required for addon item')
        }
        const lineTotal = unitAmountCents * quantity
        totalAmountCents += lineTotal
        addonLines.push({
          serviceId: item.serviceId || null,
          name: item.name,
          quantity,
          unitAmountCents,
          totalAmountCents: lineTotal,
        })
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO service_orders
        (company_id, requested_by_user_id, service_id, currency, amount_cents, payment_status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, 'pending_payment')
      `,
      [
        companyId,
        requestedByUserId,
        serviceId,
        normalizedCurrency,
        totalAmountCents,
      ]
    )

    const insertId = result.insertId

    const baseLine = {
      serviceId,
      name: title || '',
      quantity: 1,
      unitAmountCents: baseAmountCents,
      totalAmountCents: baseAmountCents,
    }

    const lines = [baseLine, ...addonLines]

    for (const line of lines) {
      await db.query(
        `
        INSERT INTO service_order_items
          (service_order_id, service_id, name, quantity, unit_amount_cents, total_amount_cents)
        VALUES
          (?, ?, ?, ?, ?, ?)
        `,
        [
          insertId,
          line.serviceId,
          line.name,
          line.quantity,
          line.unitAmountCents,
          line.totalAmountCents,
        ]
      )
    }

    const [[row]] = await db.query(
      `
      SELECT
        so.*,
        s.code AS service_code
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
    await db.query(
      `UPDATE service_orders SET payment_status = 'paid' WHERE id = ?`,
      [serviceOrderId]
    )
  },
}
