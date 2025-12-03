import { BalancePreparationIntakeModel } from '../../models/balancePreparationIntake.model.js'
import { Service } from '../../models/service.model.js'

export const BalancePreparationIntakeController = {
  async getAll(req, res) {
    try {
      const rows = await BalancePreparationIntakeModel.getAll()
      return res.json(rows)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async create(req, res) {
    try {
      const body = req.body
      const { companyId } = req.params
      const service = await Service.getByCode('balance')
      const payload = {
        ...body,
        company_id: companyId,
        service_id: service.id,
      }
      const created = await BalancePreparationIntakeModel.create(payload)
      return res.status(201).json(created)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await BalancePreparationIntakeModel.update(id, req.body)
      if (!updated) {
        return res
          .status(404)
          .json({ message: 'Balance preparation intake not found' })
      }
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
