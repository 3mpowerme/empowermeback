import db from '../config/db.js'

export async function upsertBillingCustomer({
  companyId,
  provider,
  externalCustomerId,
}) {
  await db.query(
    `INSERT INTO billing_customer (company_id, provider, external_customer_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE external_customer_id = VALUES(external_customer_id)`,
    [companyId, provider, externalCustomerId]
  )
  return externalCustomerId
}

export async function saveWebhookEventOnce({
  provider,
  eventId,
  type,
  payload,
}) {
  try {
    await db.query(
      `INSERT INTO webhook_events (provider, event_id, type, payload_json)
       VALUES (?, ?, ?, ?)`,
      [provider, eventId, type, JSON.stringify(payload)]
    )
    return true
  } catch {
    return false
  }
}

export function centsFromDecimal(decimalStrOrNumber) {
  const n =
    typeof decimalStrOrNumber === 'string'
      ? parseFloat(decimalStrOrNumber)
      : decimalStrOrNumber
  return Math.round(n * 100)
}
