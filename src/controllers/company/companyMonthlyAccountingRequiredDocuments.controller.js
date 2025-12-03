import { Billing } from '../../models/billing.model.js'
import { Company } from '../../models/company.model.js'
import { CompanyMonthlyAccountingRequest } from '../../models/companyMonthlyAccountingRequest.model.js'
import { CompanyMonthlyAccountingRequiredDocuments } from '../../models/companyMonthlyAccountingRequiredDocuments.model.js'
import { Service } from '../../models/service.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const CompanyMonthlyAccountingRequiredDocumentsController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const companyMonthlyAccountingRequest =
        await CompanyMonthlyAccountingRequiredDocuments.getById(companyId)

      res.json(companyMonthlyAccountingRequest || {})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const {
        company_rut,
        company_statute_or_constitution,
        proof_of_address,
        legal_representative_rut,
        legal_representative_key,
        activities,
      } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const { companyId } = req.params
      const service = await Service.getByCode('accounting')
      console.log('service: ', service)

      await CompanyMonthlyAccountingRequiredDocuments.create(
        companyId,
        service?.id,
        company_rut,
        company_statute_or_constitution,
        proof_of_address,
        legal_representative_rut,
        legal_representative_key,
        activities
      )
      res.status(201).json({ message: 'success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  async update(req, res) {
    try {
      // TODO
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
