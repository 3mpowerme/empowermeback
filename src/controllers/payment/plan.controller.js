import { stripe } from '../../config/stripe.js'
import { Billing } from '../../models/billing.model.js'
import { Payment } from '../../models/payment.model.js'
import { Plan } from '../../models/plan.model.js'
import { Service } from '../../models/service.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const PlanController = {
  async getPlans(req, res) {
    try {
      const rows = await Plan.getPlans()
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to get plans' })
    }
  },

  async getPlansByServiceCode(req, res) {
    try {
      const { service_code } = req.params
      console.log('service_code', service_code)
      const rows = await Plan.getPlansByServiceCode(service_code)
      console.log('rows', rows)
      res.json(rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to get plans' })
    }
  },
}
