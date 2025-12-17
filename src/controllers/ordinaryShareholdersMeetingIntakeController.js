import { Service } from '../models/service.model.js'
import { OrdinaryShareholdersMeetingIntakeModel } from '../models/ordinaryShareholdersMeetingIntake.model.js'

export const OrdinaryShareholdersMeetingIntakeController = {
  async create(req, res) {
    try {
      const { companyId } = req.params

      const service = await Service.getByCode('ordinary_shareholders_meeting')
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created =
        await OrdinaryShareholdersMeetingIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
