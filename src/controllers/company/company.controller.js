import { Company } from '../../models/company.model.js'

export const CompanyController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId: ownerUserId } = await UserIdentity.getUserIdBySub(sub)
      const rows = await Company.getAll(userId)
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body
      const sub = req.user.sub
      const { userId: ownerUserId } = await UserIdentity.getUserIdBySub(sub)

      const newRow = await Company.create(ownerUserId, name)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
