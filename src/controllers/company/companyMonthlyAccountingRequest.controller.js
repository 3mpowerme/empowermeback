import { Billing } from '../../models/billing.model.js'
import { Company } from '../../models/company.model.js'
import { CompanyMonthlyAccountingRequest } from '../../models/companyMonthlyAccountingRequest.model.js'
import { Service } from '../../models/service.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const CompanyMonthlyAccountingRequestController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const companyMonthlyAccountingRequest =
        await CompanyMonthlyAccountingRequest.getById(companyId)
      console.log(
        'companyMonthlyAccountingRequest',
        companyMonthlyAccountingRequest
      )
      const companyCommercialMovements =
        await CompanyMonthlyAccountingRequest.getCommercialMovementsById(
          companyId
        )
      console.log('companyCommercialMovements', companyCommercialMovements)
      if (companyMonthlyAccountingRequest)
        companyMonthlyAccountingRequest.commercial_movements =
          companyCommercialMovements?.movement_id
      return res.json(companyMonthlyAccountingRequest || {})
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const {
        email,
        company_contact_phone,
        legal_representative_name,
        legal_representative_rut,
        legal_representative_phone,
        need_startup_support,
        commercial_movements,
      } = req.body
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { companyId } = req.params
      const service = await Service.getByCode('accounting')
      console.log('service: ', service)

      await CompanyMonthlyAccountingRequest.create(
        companyId,
        email,
        company_contact_phone,
        legal_representative_name,
        legal_representative_rut,
        legal_representative_phone,
        need_startup_support,
        commercial_movements,
        service?.id
      )

      /*
      const so = await Billing.createServiceOrder(
        companyId,
        service?.id,
        service?.default_amount_cents,
        service?.default_currency,
        userId
      )
        */

      res.status(201).json({ message: 'success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  async update(req, res) {
    try {
      const { need_startup_support, commercial_movements } = req.body
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const updated = await CompanyMonthlyAccountingRequest.update(
        companyId,
        need_startup_support,
        commercial_movements
      )
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
