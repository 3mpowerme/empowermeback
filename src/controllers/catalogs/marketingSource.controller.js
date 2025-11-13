import { MarketingSource } from '../../models/marketingSource.model.js'

export const MarketingSourceController = {
  async getAll(req, res) {
    try {
      const rows = await MarketingSource.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await MarketingSource.getById(id)
      if (!row)
        return res.status(404).json({ message: 'Marketing source not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, image } = req.body
      const newRow = await MarketingSource.create(name, image)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, image } = req.body
      const updated = await MarketingSource.update(id, name, image)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await MarketingSource.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
