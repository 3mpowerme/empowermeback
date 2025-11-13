import { Company } from '../../models/company.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'
import openai from '../../config/openaiClient.js'
import { MarketAnalysis } from '../../models/marketAnalysis.model.js'
export const MarketAnalysisController = {
  async get(req, res) {
    try {
      const { id } = req.params
      const row = await MarketAnalysis.getById(id)
      if (!row)
        return res.status(404).json({ message: 'Market Analysis not found' })
      res.json(row)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
