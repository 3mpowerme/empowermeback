import { Feature } from '../../models/feature.model.js'

export const FeatureController = {
  async getAll(req, res) {
    try {
      const rows = await Feature.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await Feature.getById(id)
      if (!row) return res.status(404).json({ message: 'Feature not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, image, link } = req.body
      const newRow = await Feature.create(name, image, link)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, image, link } = req.body
      const updated = await Feature.update(id, name, image, link)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await Feature.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
