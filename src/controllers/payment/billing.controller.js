import { stripe } from '../../config/stripe.js'
import { Billing } from '../../models/billing.model.js'
import { Payment } from '../../models/payment.model.js'
import { Plan } from '../../models/plan.model.js'
import { Service } from '../../models/service.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const BillingController = {
  async createServiceOrder(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { companyId, serviceCode, items = [], count = 1 } = req.body
      const service = await Service.getByCode(serviceCode)

      if (!service) {
        return res.status(404).json({ error: 'Service not found' })
      }

      if (Array.isArray(items) && items.length) {
        const normalizedItems = []

        for (const item of items) {
          const addonService = await Service.getByCode(item.serviceCode)
          if (!addonService) {
            return res
              .status(400)
              .json({ error: `Invalid addon serviceCode: ${item.serviceCode}` })
          }
          const quantity = Number(item.quantity) || 1
          normalizedItems.push({
            serviceId: addonService.id,
            name: addonService.name,
            quantity,
            unitAmountCents: addonService.default_amount_cents,
          })
        }

        const so = await Billing.createServiceOrderWithItems(
          companyId,
          service.id,
          service.default_amount_cents,
          service.default_currency,
          normalizedItems,
          userId
        )

        return res.json({ serviceOrderId: so.id })
      }

      const plan = await Plan.getPlanByCode(service.code)
      console.log('plan', plan)
      const so = await Billing.createServiceOrder(
        companyId,
        service.id,
        plan.amount_cents * count, // could be more than one item
        plan.currency,
        userId,
        count
      )

      res.json({ serviceOrderId: so.id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create ServiceOrder' })
    }
  },

  async createPaymentIntent(req, res) {
    try {
      const { serviceOrderId } = req.body
      const so = await Billing.getServiceOrder(serviceOrderId)
      if (!so) return res.status(404).json({ error: 'Service order not found' })
      if (!['pending_payment', 'failed', 'refunded'].includes(so.status))
        return res.status(400).json({ error: 'Service order is not payable' })

      const email = await Billing.getCompanyOwnerEmail(so.company_id)
      const customerId = await Billing.getOrCreateStripeCustomerId(
        so.company_id,
        email,
        stripe
      )

      const pi = await stripe.paymentIntents.create({
        customer: customerId,
        amount: so.amount_cents,
        currency: so.currency.toLowerCase(),
        description: so.title || so.service_code,
        metadata: {
          company_id: String(so.company_id),
          service_order_id: String(so.id),
        },
        automatic_payment_methods: { enabled: true },
      })

      await Payment.insertPayment({
        companyId: so.company_id,
        type: 'service_order',
        provider: 'stripe',
        amountCents: so.amount_cents,
        currency: so.currency.toUpperCase(),
        status: 'pending',
        externalPaymentIntentId: pi.id,
        serviceOrderId: so.id,
      })

      res.json({ clientSecret: pi.client_secret })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create PaymentIntent' })
    }
  },

  async createPortalSession(req, res) {
    try {
      const { companyId, returnUrl } = req.body

      const [[bc]] = await stripe._api.httpClient.makeRequest(async () => {})

      const email = await Billing.getCompanyOwnerEmail(companyId)
      const customerId = await Billing.getOrCreateStripeCustomerId(
        companyId,
        email,
        stripe
      )

      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${process.env.APP_URL}/dashboard/billing`,
      })

      res.json({ url: portal.url })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create portal session' })
    }
  },
}
