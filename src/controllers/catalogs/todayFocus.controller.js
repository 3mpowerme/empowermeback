import { TodayFocus } from '../../models/todayFocus.model.js'

export const TodayFocusController = {
  async getAll(req, res) {
    try {
      const rows = await TodayFocus.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await TodayFocus.getById(id)
      if (!row)
        return res.status(404).json({ message: 'Today focus not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, image } = req.body
      const newRow = await TodayFocus.create(name, image)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, image } = req.body
      const updated = await TodayFocus.update(id, name, image)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await TodayFocus.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
