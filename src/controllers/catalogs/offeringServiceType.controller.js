import { OfferingServiceType } from '../../models/offeringServiceType.model.js'

export const OfferingServiceTypeController = {
  async getAll(req, res) {
    try {
      const rows = await OfferingServiceType.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await OfferingServiceType.getById(id)
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
      const newRow = await OfferingServiceType.create(name, description, image)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, description, image } = req.body
      const updated = await OfferingServiceType.update(
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
      const deleted = await OfferingServiceType.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
