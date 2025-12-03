import { AccountingClientIntakeModel } from '../../models/monthlyAccounting.model.js'
import { Service } from '../../models/service.model.js'

export const AccountingClientIntakeController = {
  async getAll(req, res) {
    try {
      const { companyId } = req.params
      console.log('companyId', companyId)
      const companyMonthlyAccountingRequest =
        await AccountingClientIntakeModel.getById(companyId)
      console.log(
        'companyMonthlyAccountingRequest',
        companyMonthlyAccountingRequest
      )
      const companyCommercialMovements =
        await AccountingClientIntakeModel.getCommercialMovementsById(companyId)
      console.log('companyCommercialMovements', companyCommercialMovements)
      if (companyMonthlyAccountingRequest)
        companyMonthlyAccountingRequest.commercial_movements =
          companyCommercialMovements?.movement_id
      res.json(companyMonthlyAccountingRequest || {})
      const rows = await AccountingClientIntakeModel.getAll()
      return res.json(rows)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async create(req, res) {
    try {
      const body = req.body
      const { companyId } = req.params
      const service = await Service.getByCode('accounting')
      console.log('service: ', service)
      const payload = {
        ...body,
        company_id: companyId,
        service_id: service.id,
      }
      console.log('payload', payload)
      const created = await AccountingClientIntakeModel.create(
        payload,
        companyId
      )
      return res.status(201).json(created)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const parsed = true
      return res.json({ parsed })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
