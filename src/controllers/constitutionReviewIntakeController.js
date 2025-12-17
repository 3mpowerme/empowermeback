import { Service } from '../models/service.model.js'
import { ConstitutionReviewIntakeModel } from '../models/constitutionReviewIntake.model.js'

export const ConstitutionReviewIntakeController = {
  async create(req, res) {
    try {
      const { companyId } = req.params

      const service = await Service.getByCode('constitution_review')
      if (!service) {
        return res.status(404).json({ message: 'Service not found' })
      }

      const payload = {
        ...req.body,
        company_id: companyId,
        service_id: service.id,
      }

      const created = await ConstitutionReviewIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
