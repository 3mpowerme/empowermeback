import { stripe } from '../config/stripe.js'
import { Billing } from '../models/billing.model.js'
import { Plan } from '../models/plan.model.js'
import { Service } from '../models/service.model.js'
import { UserIdentity } from '../models/userIdentity.model.js'
import { validateAccessToken } from '../utils/jwtValidator.js'
import db from '../config/db.js'

const SERVICE_CODE = 'conceptualization'
const APP_URL = process.env.APP_URL || 'https://app.empowermedev.com'
const CHECKOUT_SUCCESS_URL = `${APP_URL}/dashboard/conceptualization`
const CHECKOUT_CANCEL_URL = `${APP_URL}/dashboard/conceptualization`
// Checkout session expiry in seconds (30 min)
const CHECKOUT_EXPIRY_SECONDS = 1800

async function getUserFromToken(accessToken) {
  const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken
  const decoded = await validateAccessToken(token)
  const { userId } = await UserIdentity.getUserIdBySub(decoded.sub)
  const email = decoded.email || decoded['cognito:username'] || null
  return { userId, sub: decoded.sub, email }
}

async function getOrCreateStripeCustomerByUser(userId, email) {
  // 1. Try by user_id directly
  const [[bcByUser]] = await db.query(
    `SELECT * FROM billing_customers WHERE user_id = ? AND provider = 'stripe' LIMIT 1`,
    [userId]
  )
  if (bcByUser?.external_customer_id) return bcByUser.external_customer_id

  // 2. Try by company owned by this user
  const [[bcByCompany]] = await db.query(
    `SELECT bc.* FROM billing_customers bc
     JOIN companies c ON c.id = bc.company_id
     WHERE c.owner_user_id = ? AND bc.provider = 'stripe' LIMIT 1`,
    [userId]
  )
  if (bcByCompany?.external_customer_id) return bcByCompany.external_customer_id

  // 3. Create new Stripe customer
  const customer = await stripe.customers.create({
    email: email || undefined,
    metadata: { user_id: String(userId) },
  })

  // 4. Store with user_id (company_id = NULL)
  // The unique key is on (company_id, provider) — with company_id NULL, MySQL allows multiple NULLs
  await db.query(
    `INSERT INTO billing_customers (user_id, company_id, provider, external_customer_id)
     VALUES (?, NULL, 'stripe', ?)`,
    [userId, customer.id]
  )

  return customer.id
}

export const PaymentMcpService = {
  async createCheckout({ accessToken }) {
    try {
      const { userId, email } = await getUserFromToken(accessToken)

      // Get service and plan
      const service = await Service.getByCode(SERVICE_CODE)
      if (!service) return { ok: false, error: 'Service not found: conceptualization' }

      const plan = await Plan.getPlanByCode(SERVICE_CODE)
      if (!plan) return { ok: false, error: 'Plan not found for conceptualization' }

      // Reuse already-paid unfinished order when available
      const reusableOrder = await Billing.findReusablePaidServiceOrderByUser({
        userId,
        serviceCode: SERVICE_CODE,
      })

      if (reusableOrder) {
        return {
          ok: true,
          reused: true,
          alreadyPaid: true,
          serviceOrderId: reusableOrder.id,
          status: reusableOrder.payment_status,
          fulfillmentStatus: reusableOrder.fulfillment_status,
        }
      }

      // Create service order (no company required for conceptualization)
      const so = await Billing.createServiceOrder(
        null, // companyId — null for standalone conceptualization
        service.id,
        plan.amount_cents,
        plan.currency,
        userId,
        1
      )

      // Get or create Stripe customer
      const customerId = await getOrCreateStripeCustomerByUser(userId, email)

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: (plan.currency || 'clp').toLowerCase(),
              product_data: {
                name: service.name || 'Conceptualización EmpowerMe',
                description: 'Análisis de mercado y plan de negocios',
              },
              unit_amount: plan.amount_cents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          service_order_id: String(so.id),
          user_id: String(userId),
          service_code: SERVICE_CODE,
        },
        success_url: CHECKOUT_SUCCESS_URL,
        cancel_url: CHECKOUT_CANCEL_URL,
        expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_SECONDS,
      })

      return {
        ok: true,
        checkoutUrl: session.url,
        serviceOrderId: so.id,
        sessionId: session.id,
        expiresAt: new Date((Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_SECONDS) * 1000).toISOString(),
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },

  async checkStatus({ serviceOrderId }) {
    try {
      const so = await Billing.getServiceOrder(serviceOrderId)
      if (!so) return { ok: false, error: 'Service order not found' }
      return {
        ok: true,
        serviceOrderId: so.id,
        status: so.payment_status, // 'pending_payment' | 'paid' | 'failed'
        fulfillmentStatus: so.fulfillment_status,
        paid: so.payment_status === 'paid',
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },
}
