import { Country } from '../../models/country.model.js'

export const CountriesController = {
  async getAll(req, res) {
    try {
      const rows = await Country.getAll()
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
