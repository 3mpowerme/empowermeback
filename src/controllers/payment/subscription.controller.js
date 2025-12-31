import { stripe } from '../../config/stripe.js'
import { Subscription } from '../../models/subscription.model.js'
import { Billing } from '../../models/billing.model.js'
import { Payment } from '../../models/payment.model.js'
import db from '../../config/db.js'

function formatPriceSummary(plan) {
  const amountCents = plan.amount_cents || plan.amountCents || 0
  const currency = (plan.currency || 'MXN').toUpperCase()
  const howOften = plan.how_often
  const intervalCount = plan.interval_count || 1

  const total = amountCents / 100

  let intervalo
  if (howOften === 'month') {
    intervalo = intervalCount === 1 ? 'mes' : `${intervalCount} meses`
  } else if (howOften === 'year') {
    intervalo = 'año'
  } else if (howOften === 'week') {
    intervalo = intervalCount === 1 ? 'semana' : `${intervalCount} semanas`
  } else if (howOften === 'day') {
    intervalo = intervalCount === 1 ? 'día' : `${intervalCount} días`
  } else {
    intervalo = 'periodo'
  }

  const prettyAmount = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total)

  return `${prettyAmount} ${currency} / ${intervalo}`
}

export const SubscriptionsController = {
  async create(req, res) {
    try {
      const { companyId, planId } = req.body

      if (!companyId || !planId) {
        return res.status(400).json({
          error: 'companyId and planId are required',
        })
      }

      const plan = await Subscription.getPlan(planId)
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' })
      }
      if (plan.is_active === 0) {
        return res.status(400).json({ error: 'Plan is not active' })
      }

      const alreadyHasThisService =
        await Subscription.hasActiveSubscriptionForService(
          companyId,
          plan.service_id
        )

      if (alreadyHasThisService) {
        return res.status(400).json({
          error:
            'Ya tienes una suscripción activa para este servicio. No puedes duplicarlo.',
        })
      }

      const email = await Billing.getCompanyOwnerEmail(companyId)
      const customerId = await Billing.getOrCreateStripeCustomerId(
        companyId,
        email,
        stripe
      )

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripe_price_id }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          company_id: String(companyId),
          plan_id: String(planId),
          service_id: String(plan.service_id),
          email,
        },
      })

      const latestInvoice = subscription.latest_invoice
      const invoicePI = latestInvoice?.payment_intent

      if (invoicePI) {
        await Payment.insertPayment({
          companyId,
          type: 'subscription',
          provider: 'stripe',
          amountCents: invoicePI.amount,
          currency: invoicePI.currency.toUpperCase(),
          status: invoicePI.status || 'pending',
          externalPaymentIntentId: invoicePI.id,
          externalInvoiceId: latestInvoice?.id,
          externalSubscriptionId: subscription.id,
        })
      }

      if (Subscription.upsertLocalSubscriptionDraft) {
        await Subscription.upsertLocalSubscriptionDraft({
          companyId,
          planId,
          provider: 'stripe',
          externalSubscriptionId: subscription.id,
          status: subscription.status || 'incomplete',
          cancelAtPeriodEnd: subscription.cancel_at_period_end ? 1 : 0,
          currentPeriodStart: null,
          currentPeriodEnd: null,
        })
      }

      const planName = plan.name
      const priceSummary = formatPriceSummary(plan)

      return res.json({
        subscriptionId: subscription.id,
        clientSecret: invoicePI?.client_secret || null,
        status: subscription.status,
        planName,
        priceSummary,
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Failed to create subscription' })
    }
  },

  async listActive(req, res) {
    try {
      const companyId = Number(req.params.companyId)

      if (!companyId) {
        return res.status(400).json({
          error: 'companyId is required',
        })
      }

      const subs = await Subscription.getActiveSubscriptionsByCompany(companyId)

      const formatted = subs.map((row) => {
        return {
          subscriptionId: row.subscription_id,
          externalSubscriptionId: row.external_subscription_id,
          status: row.status,
          cancelAtPeriodEnd: !!row.cancel_at_period_end,

          currentPeriodStart: row.current_period_start
            ? row.current_period_start.toISOString()
            : null,
          currentPeriodEnd: row.current_period_end
            ? row.current_period_end.toISOString()
            : null,

          plan: {
            id: row.plan_id,
            name: row.plan_name,
            serviceId: row.service_id,
            priceSummary: formatPriceSummary({
              amount_cents: row.amount_cents,
              currency: row.currency,
              how_often: row.how_often,
              interval_count: row.interval_count,
            }),
          },
        }
      })

      return res.json({
        companyId,
        subscriptions: formatted,
      })
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ error: 'Failed to fetch active subscriptions' })
    }
  },

  async cancel(req, res) {
    try {
      const id = req.params.id
      const mode = (req.body?.mode || 'at_period_end').toString()

      const sub = await Subscription.getByExternalSubscriptionId(id)

      console.log('sub', sub)
      if (!sub) return res.status(404).json({ error: 'Not found' })

      if (sub.provider === 'stripe' && sub.external_subscription_id && stripe) {
        if (mode === 'immediate') {
          await stripe.subscriptions.cancel(sub.external_subscription_id)
          /*
          await db.query(
            `update subscriptions set status = 'canceled', cancel_at_period_end = 0, updated_at = current_timestamp where id = ?`,
            [id]
          )
          await db.query(
            `insert into subscription_history (subscription_id, old_status, new_status, notes) values (?, ?, ?, ?)`,
            [id, sub.status, 'canceled', 'immediate']
          )
            */
        } else {
          await stripe.subscriptions.update(sub.external_subscription_id, {
            cancel_at_period_end: true,
          })
          /*
          await db.query(
            `update subscriptions set cancel_at_period_end = 1, updated_at = current_timestamp where id = ?`,
            [id]
          )
          await db.query(
            `insert into subscription_history (subscription_id, old_status, new_status, notes) values (?, ?, ?, ?)`,
            [id, sub.status, sub.status, 'at_period_end']
          )
            */
        }
      }
      /*else {
        if (mode === 'immediate') {
          await db.query(
            `update subscriptions set status = 'canceled', cancel_at_period_end = 0, updated_at = current_timestamp where id = ?`,
            [id]
          )
          await db.query(
            `insert into subscription_history (subscription_id, old_status, new_status, notes) values (?, ?, ?, ?)`,
            [id, sub.status, 'canceled', 'immediate_no_provider']
          )
        } else {
          await db.query(
            `update subscriptions set cancel_at_period_end = 1, updated_at = current_timestamp where id = ?`,
            [id]
          )
          await db.query(
            `insert into subscription_history (subscription_id, old_status, new_status, notes) values (?, ?, ?, ?)`,
            [id, sub.status, sub.status, 'at_period_end_no_provider']
          )
        }
      }
*/
      const [[updated]] = await db.query(
        `select s.id, s.company_id, s.plan_id, s.provider, s.external_subscription_id, s.status, s.cancel_at_period_end, s.current_period_end, s.current_period_start
       from subscriptions s where s.id = ?`,
        [id]
      )
      return res.json(updated)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'failed' })
    }
  },
}
