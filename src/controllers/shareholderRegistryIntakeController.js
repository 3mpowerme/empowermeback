import { Service } from '../models/service.model.js'
import { ShareholderRegistryIntakeModel } from '../models/shareholderRegistryIntake.model.js'

export const ShareholderRegistryIntakeController = {
  async create(req, res) {
    try {
      const { companyId } = req.params

      const service = await Service.getByCode('shareholders_registry')
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created = await ShareholderRegistryIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
