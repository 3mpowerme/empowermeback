import { Company } from '../../models/company.model.js'
import { ServiceRequest } from '../../models/serviceRequest.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const ServiceRequestController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const serviceRequest = await ServiceRequest.getByCompanyId(companyId)
      res.json(serviceRequest || [])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const {
        contact_name = null,
        contact_email = null,
        contact_phone = null,
        service_type,
      } = req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const newRow = await ServiceRequest.create(
        companyId,
        contact_name,
        contact_email,
        contact_phone,
        service_type
      )
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { contact_name, contact_email, contact_phone, service_type } =
        req.body

      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const companyResult = await Company.getCompanyIdByUserId(userId)
      const { id: companyId } = companyResult

      const updated = await ServiceRequest.update(
        companyId,
        contact_name,
        contact_email,
        contact_phone,
        service_type
      )
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params
      const { status } = req.body
      const sub = req.user.sub
      const updated = await ServiceRequest.updateStatus(id, status)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
