import { Region } from '../../models/region.model.js'

export const RegionController = {
  async getAll(req, res) {
    try {
      const rows = await Region.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await Region.getById(id)
      if (!row) return res.status(404).json({ message: 'Region not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body
      const newRow = await Region.create(name)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const updated = await Region.update(id, name)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await Region.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
