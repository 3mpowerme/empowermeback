import { CompanyRegisteredServices } from '../models/companyRegisteredServices.model.js'

export const CompanyRegisteredServicesController = {
  async list(req, res) {
    try {
      const { companyId } = req.params
      const { page } = req.query
      const allServices = await CompanyRegisteredServices.getAllByPage(
        companyId,
        page
      )
      return res.json(allServices)
    } catch (error) {
      console.error(error)
    }
  },
}
