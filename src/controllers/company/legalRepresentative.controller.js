import { Company } from '../../models/company.model.js'
import { LegalRepresentative } from '../../models/legalRepresentative.mode.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const LegalRepresentativeController = {
  async getAll(req, res) {
    try {
      const { companyId } = req.params
      const legalRepresentative = await LegalRepresentative.getById(companyId)
      res.json(legalRepresentative || {})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, rut, phone, password } = req.body
      const { companyId } = req.params
      const newRow = await LegalRepresentative.create(
        companyId,
        name,
        rut,
        phone,
        password
      )
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  async update(req, res) {
    try {
      const { name, rut, phone, password } = req.body
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const updated = await LegalRepresentative.update(
        companyId,
        name,
        rut,
        phone,
        password
      )
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
