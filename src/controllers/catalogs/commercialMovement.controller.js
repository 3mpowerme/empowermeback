import { CommercialMovement } from '../../models/commercialMovement.mode.js'

export const CommercialMovementController = {
  async getAll(req, res) {
    try {
      const rows = await CommercialMovement.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await CommercialMovement.getById(id)
      if (!row)
        return res
          .status(404)
          .json({ message: 'Commercial movement not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body
      const newRow = await CommercialMovement.create(name)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const updated = await CommercialMovement.update(id, name)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await CommercialMovement.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
