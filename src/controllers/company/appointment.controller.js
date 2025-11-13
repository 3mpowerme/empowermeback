import { Company } from '../../models/company.model.js'
import { Appointment } from '../../models/appointment.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const AppointmentController = {
  async getAll(req, res) {
    try {
      const { companyId } = req.params
      const serviceRequest = await Appointment.getByCompanyId(companyId)
      res.json(serviceRequest || [])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { service_request_id, calendly_event_uri, scheduled_date, status } =
        req.body

      const sub = req.user.sub

      const newRow = await Appointment.create(
        service_request_id,
        calendly_event_uri,
        scheduled_date,
        status
      )
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateScheduledDate(req, res) {
    try {
      const { id } = req.params
      const { scheduled_date } = req.body

      const sub = req.user.sub

      const updated = await Appointment.updateScheduledDate(id, scheduled_date)
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

      const updated = await Appointment.updateStatus(id, status)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
