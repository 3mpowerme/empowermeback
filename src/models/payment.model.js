import db from '../config/db.js'

export const Payment = {
  async insertPayment({
    companyId,
    type,
    provider,
    amountCents,
    currency,
    status,
    externalPaymentIntentId,
    externalInvoiceId,
    externalChargeId,
    subscriptionId,
    serviceOrderId,
  }) {
    const [r] = await db.query(
      `INSERT INTO payments
       (company_id, type, provider, amount_cents, currency, status,
        external_payment_intent_id, external_invoice_id, external_charge_id,
        subscription_id, service_order_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyId,
        type,
        provider,
        amountCents,
        currency,
        status,
        externalPaymentIntentId || null,
        externalInvoiceId || null,
        externalChargeId || null,
        subscriptionId || null,
        serviceOrderId || null,
      ]
    )
    return r.insertId
  },

  async updatePaymentStatusByPI(paymentIntentId, status) {
    await db.query(
      `UPDATE payments SET status = ? WHERE external_payment_intent_id = ?`,
      [status, paymentIntentId]
    )
  },

  async markInvoiceSucceeded({
    externalInvoiceId,
    paymentIntentId,
    amountCents,
    currency,
  }) {
    const upperCurrency = (currency || 'CLP').toUpperCase()

    const [updateResult] = await db.execute(
      `
      UPDATE payments
      SET
        status = 'succeeded',
        amount_cents = ?,
        currency = ?,
        external_payment_intent_id = ?
      WHERE external_invoice_id = ?
      `,
      [amountCents, upperCurrency, paymentIntentId || null, externalInvoiceId]
    )

    if (updateResult.affectedRows > 0) {
      return
    }

    await db.execute(
      `
      INSERT INTO payments
        (company_id,
         type,
         provider,
         amount_cents,
         currency,
         status,
         external_payment_intent_id,
         external_invoice_id,
         external_charge_id,
         subscription_id,
         service_order_id)
      VALUES
        (
          NULL, -- <-- si quieres, aquí podemos meter company_id si lo conoces
          'subscription',
          'stripe',
          ?,
          ?,
          'succeeded',
          ?,
          ?,
          NULL,
          NULL,
          NULL
        )
      `,
      [amountCents, upperCurrency, paymentIntentId || null, externalInvoiceId]
    )
  },

  async markInvoiceFailed({
    externalInvoiceId,
    paymentIntentId,
    amountCents,
    currency,
  }) {
    const upperCurrency = (currency || 'CLP').toUpperCase()

    const [updateResult] = await db.execute(
      `
      UPDATE payments
      SET
        status = 'failed',
        amount_cents = ?,
        currency = ?,
        external_payment_intent_id = ?
      WHERE external_invoice_id = ?
      `,
      [amountCents, upperCurrency, paymentIntentId || null, externalInvoiceId]
    )

    if (updateResult.affectedRows > 0) {
      return
    }

    await db.execute(
      `
      INSERT INTO payments
        (company_id,
         type,
         provider,
         amount_cents,
         currency,
         status,
         external_payment_intent_id,
         external_invoice_id,
         external_charge_id,
         subscription_id,
         service_order_id)
      VALUES
        (
          NULL,
          'subscription',
          'stripe',
          ?,
          ?,
          'failed',
          ?,
          ?,
          NULL,
          NULL,
          NULL
        )
      `,
      [amountCents, upperCurrency, paymentIntentId || null, externalInvoiceId]
    )
  },
}
