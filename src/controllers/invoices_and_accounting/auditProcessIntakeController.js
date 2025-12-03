import { AuditProcessIntakeModel } from '../../models/auditProcessIntake.model.js'
import { Service } from '../../models/service.model.js'

export const AuditProcessIntakeController = {
  async getAll(req, res) {
    try {
      const rows = await AuditProcessIntakeModel.getAll()
      return res.json(rows)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async create(req, res) {
    try {
      const body = req.body
      const { companyId } = req.params
      const service = await Service.getByCode('audit')
      console.log('service: ', service)
      const payload = {
        ...body,
        company_id: companyId,
        service_id: service.id,
      }
      console.log('payload', payload)
      const created = await AuditProcessIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await AuditProcessIntakeModel.update(id, req.body)
      if (!updated) {
        return res
          .status(404)
          .json({ message: 'Audit process intake not found' })
      }
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
