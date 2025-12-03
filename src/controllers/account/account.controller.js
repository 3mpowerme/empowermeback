import { Account } from '../../models/account.model.js'
import { Address } from '../../models/address.model.js'
import { UserIdentity } from '../../models/userIdentity.model.js'

export const AccountController = {
  async getCompanySetupByCompanyId(req, res) {
    try {
      const { companyId } = req.params
      const companySetup = await Account.getCompanySetupByCompanyId(companyId)
      console.log('companySetup', companySetup)
      const address = await Address.get(companySetup?.address_id)
      return res.status(200).json({ ...companySetup, ...address })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
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
  async update(req, res) {
    try {
      const { companyId } = req.params
      const { street, zip_code, phone_number, region_id, about } = req.body
      const companySetup = await Account.getCompanySetupByCompanyId(companyId)
      console.log('companySetup', companySetup)
      const { address_id } = companySetup
      await Address.update(
        street,
        zip_code,
        phone_number,
        region_id,
        address_id
      )
      const result = await Account.update({ about }, companyId)
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
