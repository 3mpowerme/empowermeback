import { Company } from '../../models/company.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import { ServiceRequest } from '../../models/serviceRequest.model.js'
import { Service } from '../../models/service.model.js'
import { Billing } from '../../models/billing.model.js'

export const CompanyDissolutionOfSrlController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const registry =
        await ServiceRequest.getWithAppointMentByCompanyId(companyId)
      console.log('companyDissolutionOfSpa', registry)
      res.json(registry || {})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { contact_name, contact_email, contact_phone } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { companyId } = req.params
      const service = await Service.getByCode('dissolution_of_srl')
      console.log('service: ', service)

      await ServiceRequest.create(
        companyId,
        service?.id,
        contact_name,
        contact_email,
        contact_phone
      )

      const so = await Billing.createServiceOrder(
        companyId,
        service?.id,
        service?.default_amount_cents,
        service?.default_currency,
        userId
      )
      res.status(201).json(so)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { contact_name, contact_email, contact_phone } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const updated = await ServiceRequest.update(
        companyId,
        contact_name,
        contact_email,
        contact_phone,
        'dissolution_of_srl'
      )

      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
