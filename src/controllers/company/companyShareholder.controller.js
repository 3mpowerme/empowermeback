import { Company } from '../../models/company.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import { CompanyShareholder } from '../../models/companyShareholder.model.js'

export const CompanyShareholderController = {
  async getAll(req, res) {
    try {
      const { companyId } = req.params

      const shareholders = await CompanyShareholder.getByCompanyId(companyId)
      res.json(shareholders)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const {
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality,
      } = req.body
      const { companyId } = req.params

      const newShareholder = await CompanyShareholder.create(
        companyId,
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality
      )

      res.status(201).json(newShareholder)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const {
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality,
      } = req.body
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const updated = await CompanyShareholder.update(
        companyId,
        full_name,
        rut,
        address,
        phone,
        profession,
        type,
        email,
        unique_key,
        nationality
      )

      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      await CompanyShareholder.delete(id)
      res.json({ message: 'Shareholder deleted successfully', id })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
