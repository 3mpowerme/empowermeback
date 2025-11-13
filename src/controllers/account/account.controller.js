import { UserIdentity } from '../../models/userIdentity.model.js'

export const AccountController = {
  async getAll(req, res) {
    try {
      const sub = req.user.sub
      const userAndCompanyInfo =
        await UserIdentity.getUserAndCompanyInfoBySub(sub)
      const companies = await UserIdentity.getUserAndCompaniesInfoByUserId(
        userAndCompanyInfo?.userId
      )
      res.json({ ...userAndCompanyInfo, companies })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
