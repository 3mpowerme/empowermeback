import { CompanyNotification } from '../models/companyNotification.model.js'

export const CompanyNotificationController = {
  async list(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const onlyUnread = req.query.onlyUnread === 'true'
      const limit = Number(req.query.limit) || 50
      const offset = Number(req.query.offset) || 0
      const isUser = Number(req.query.isUser) || 0
      const notifications =
        isUser == 1
          ? await CompanyNotification.findByUser(
              companyId,
              onlyUnread,
              limit,
              offset
            )
          : await CompanyNotification.findByCompany(
              companyId,
              onlyUnread,
              limit,
              offset
            )

      res.json({ notifications })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to list notifications' })
    }
  },

  async create(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const { title, message, type, metadata } = req.body

      const notification = await CompanyNotification.create(
        companyId,
        title,
        message,
        type || null,
        metadata || null
      )

      res.status(201).json({ notification })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to create notification' })
    }
  },

  async markAsRead(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const id = Number(req.params.id)
      const isUser = Number(req.query.isUser) || 0

      const ok = isUser
        ? await CompanyNotification.markAsRead({ id, userId: companyId })
        : await CompanyNotification.markAsRead({ id, companyId })
      if (!ok) return res.status(404).json({ error: 'Not found' })

      const notification = await CompanyNotification.getById(id)
      res.json({ notification })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to mark as read' })
    }
  },

  async markAllAsRead(req, res) {
    try {
      const companyId = Number(req.params.companyId)
      const isUser = Number(req.query.isUser) || 0

      const updated = isUser
        ? await CompanyNotification.markAllAsRead({ userId: companyId })
        : await CompanyNotification.markAllAsRead({ companyId })
      res.json({ updated })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to mark all as read' })
    }
  },
}
