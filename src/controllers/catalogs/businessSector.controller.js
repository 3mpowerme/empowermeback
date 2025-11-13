import { BusinessSector } from '../../models/businessSector.model.js'

export const BusinessSectorController = {
  async getAll(req, res) {
    try {
      const rows = await BusinessSector.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await BusinessSector.getById(id)
      if (!row) return res.status(404).json({ message: 'Sector not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body
      const newRow = await BusinessSector.create(name)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const updated = await BusinessSector.update(id, name)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await BusinessSector.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
