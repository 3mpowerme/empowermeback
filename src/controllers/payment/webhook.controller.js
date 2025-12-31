import { stripe } from '../../config/stripe.js'
import { saveWebhookEventOnce } from '../../utils/payments.js'
import { Subscription } from '../../models/subscription.model.js'
import { Payment } from '../../models/payment.model.js'
import { Billing } from '../../models/billing.model.js'
import { send } from '../../services/email/index.js'
import { paymentSuccessTemplate } from '../../services/email/templates/paymentSuccessTemplate.js'
import { subscriptionCreatedTemplate } from '../../services/email/templates/subscriptionCreatedTemplate.js'
import { Service } from '../../models/service.model.js'
import { Plan } from '../../models/plan.model.js'
import { Company } from '../../models/company.model.js'

export const WebhookController = {
  async handle(req, res) {
    let event
    console.log('[Stripe Webhook] event received')

    try {
      const signature = req.headers['stripe-signature']
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
      console.log('[Stripe Webhook] event.type:', event.type)
    } catch (err) {
      console.error(
        '[Stripe Webhook] Error verifying webhook signature:',
        err.message
      )
      return res
        .status(400)
        .send(`[Stripe Webhook] Webhook Error: ${err.message}`)
    }

    const stored = await saveWebhookEventOnce({
      provider: 'stripe',
      eventId: event.id,
      type: event.type,
      payload: event.data,
    })
    if (!stored) {
      return res.json({ received: true, duplicate: true })
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const pi = event.data.object

          await Payment.updatePaymentStatusByPI(pi.id, 'succeeded')

          if (pi.metadata?.service_order_id) {
            await Billing.markServiceOrderPaid(
              Number(pi.metadata.service_order_id)
            )
          }
          console.log('pi.metadata?.email', pi.metadata?.email)
          await send({
            to: 'mariano@empowerme.global' || pi.metadata?.email,
            ...paymentSuccessTemplate({ paymentIntent: pi }),
          })

          break
        }

        case 'payment_intent.payment_failed': {
          const pi = event.data.object
          await Payment.updatePaymentStatusByPI(pi.id, 'failed')
          break
        }

        case 'invoice.payment_succeeded': {
          console.log('invoice.payment_succeeded received')
          const invoice = event.data.object
          console.log('invoice', invoice)

          await Payment.markInvoiceSucceeded({
            externalInvoiceId: invoice.id,
            paymentIntentId: invoice.payment_intent,
            amountCents: invoice.total,
            currency: invoice.currency,
          })

          if (invoice.billing_reason === 'subscription_create') {
            const stripeSub = await stripe.subscriptions.retrieve(
              invoice.parent.subscription_details.subscription,
              { expand: ['items.data.price'] }
            )
            console.log('stripeSub', stripeSub)
            await Subscription.upsertSubscriptionFromStripe(stripeSub)
          }

          break
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object

          await Payment.markInvoiceFailed({
            externalInvoiceId: invoice.id,
            paymentIntentId: invoice.payment_intent,
            amountCents: invoice.total,
            currency: invoice.currency,
          })

          if (invoice.subscription) {
            await Subscription.markPastDueByExternalId(invoice.subscription)
          }

          break
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const stripeSub = event.data.object
          await Subscription.upsertSubscriptionFromStripe(stripeSub)
          const status = String(stripeSub?.status || '')
          const cancellation_reason = stripeSub?.cancellation_details?.reason
          if (status !== 'incomplete') {
            const companyId = stripeSub?.metadata?.company_id
              ? String(stripeSub.metadata.company_id)
              : ''
            const serviceId = stripeSub?.metadata?.service_id
              ? String(stripeSub.metadata.service_id)
              : ''
            const planId = stripeSub?.metadata?.plan_id
              ? String(stripeSub.metadata.plan_id)
              : ''
            const plan = await Plan.getPlanById(planId)
            const servie = await Service.getServiceById(serviceId)
            const company = await Company.getCompanyById(companyId)

            const serviceName = servie?.name,
              planName = plan?.name,
              companyName = company?.name

            await send({
              to: 'mariano@empowerme.global' || stripeSub.metadata?.email,
              ...subscriptionCreatedTemplate({
                subscription: stripeSub,
                serviceName,
                planName,
                companyName,
                isCancelled: cancellation_reason === 'cancellation_requested',
              }),
            })
          }

          break
        }

        case 'customer.subscription.deleted': {
          const stripeSub = event.data.object

          await Subscription.markCanceledByExternalId(stripeSub.id)
          const companyId = stripeSub?.metadata?.company_id
            ? String(stripeSub.metadata.company_id)
            : ''
          const serviceId = stripeSub?.metadata?.service_id
            ? String(stripeSub.metadata.service_id)
            : ''
          const planId = stripeSub?.metadata?.plan_id
            ? String(stripeSub.metadata.plan_id)
            : ''
          const plan = await Plan.getPlanById(planId)
          const servie = await Service.getServiceById(serviceId)
          const company = await Company.getCompanyById(companyId)
          const serviceName = servie?.name,
            planName = plan?.name,
            companyName = company?.name
          await send({
            to: 'mariano@empowerme.global' || stripeSub.metadata?.email,
            ...subscriptionCreatedTemplate({
              subscription: stripeSub,
              serviceName,
              planName,
              companyName,
              isCancelled: true,
            }),
          })
          break
        }

        default: {
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
          break
        }
      }

      res.json({ received: true })
    } catch (err) {
      console.error('[Stripe Webhook] Webhook handler error:', err)
      res.status(500).send('Internal webhook handler error')
    }
  },
}
