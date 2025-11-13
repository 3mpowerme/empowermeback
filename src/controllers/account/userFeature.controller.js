import { UserFeature } from '../../models/userFeature.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const UserFeatureController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const rows = await UserFeature.getByUserId(userId)
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getById(req, res) {
    try {
      const sub = req.user.sub
      const { id: featureId } = req.params
      const { userId } = await UserIdentity.getUserIdBySub(sub)
      const rows = await UserFeature.getWizardsByUserIdByFeatureId(
        userId,
        featureId
      )
      res.json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
