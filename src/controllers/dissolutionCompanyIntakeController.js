import { DissolutionCompanyIntakeModel } from '../models/dissolutionCompanyIntake.model.js'
import { Service } from '../models/service.model.js'

const ALLOWED_SERVICE_CODES = [
  'dissolution_of_eirl',
  'dissolution_of_srl',
  'dissolution_of_spa',
]

export const DissolutionCompanyIntakeController = {
  async create(req, res) {
    try {
      const { companyId, serviceCode } = req.params

      if (!ALLOWED_SERVICE_CODES.includes(serviceCode)) {
        return res.status(400).json({ message: 'Invalid service code' })
      }

      const service = await Service.getByCode(serviceCode)
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created = await DissolutionCompanyIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
