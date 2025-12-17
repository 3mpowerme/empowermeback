import { Service } from '../models/service.model.js'
import { VirtualOfficeIntakeModel } from '../models/virtualOfficeIntake.model.js'

export const VirtualOfficeIntakeController = {
  async create(req, res) {
    try {
      const { companyId, serviceCode } = req.params

      const service = await Service.getByCode(serviceCode)
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created = await VirtualOfficeIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
