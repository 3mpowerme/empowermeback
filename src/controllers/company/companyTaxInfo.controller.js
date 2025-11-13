import { Company } from '../../models/company.model.js'
import { CompanyTaxInfo } from '../../models/companyTaxInfo.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const CompanyTaxInfoController = {
  async getAll(req, res) {
    try {
      const { companyId } = req.params
      const companyTaxInfo = await CompanyTaxInfo.getById(companyId)
      res.json(companyTaxInfo || {})
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const {
        business_name,
        email,
        phone,
        address,
        rut,
        password,
        previred_password,
        mutual_password,
      } = req.body
      const { companyId } = req.params
      const newRow = await CompanyTaxInfo.create(
        companyId,
        business_name,
        email,
        phone,
        rut,
        address,
        password,
        previred_password,
        mutual_password
      )
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  async update(req, res) {
    try {
      const {
        business_name,
        email,
        phone,
        address,
        rut,
        password,
        previred_password,
        mutual_password,
      } = req.body
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult
      const updated = await CompanyTaxInfo.update(
        companyId,
        business_name,
        email,
        phone,
        rut,
        address,
        password,
        previred_password,
        mutual_password
      )
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
