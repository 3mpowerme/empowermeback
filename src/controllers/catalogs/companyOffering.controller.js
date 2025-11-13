import { CompanyOffering } from '../../models/companyOffering.model.js'

export const CompanyOfferingController = {
  async getAll(req, res) {
    try {
      const rows = await CompanyOffering.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const row = await CompanyOffering.getById(id)
      if (!row)
        return res.status(404).json({ message: 'Company offering not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create(req, res) {
    try {
      const { name, image } = req.body
      const newRow = await CompanyOffering.create(name, image)
      res.status(201).json(newRow)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, image } = req.body
      const updated = await CompanyOffering.update(id, name, image)
      res.json(updated)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      const deleted = await CompanyOffering.remove(id)
      res.json(deleted)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
