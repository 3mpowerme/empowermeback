import { CustomerServiceChannel } from '../../models/customerServiceChannel.model.js'

export const CustomerServiceChannelController = {
  async getAll(req, res) {
    try {
      const rows = await CustomerServiceChannel.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await CustomerServiceChannel.getById(id)
      if (!row)
        return res.status(404).json({ message: 'Today focus not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, description, image } = req.body
      const newRow = await CustomerServiceChannel.create(
        name,
        description,
        image
      )
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, description, image } = req.body
      const updated = await CustomerServiceChannel.update(
        id,
        name,
        description,
        image
      )
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await CustomerServiceChannel.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
