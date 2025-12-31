import { Service } from '../models/service.model.js'
import { PurchaseSaleIntakeModel } from '../models/purchaseSaleIntake.model.js'

export const PurchaseSaleIntakeController = {
  async create(req, res) {
    try {
      const { companyId } = req.params

      const service = await Service.getByCode('share_purchase_and_sale')
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created = await PurchaseSaleIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
