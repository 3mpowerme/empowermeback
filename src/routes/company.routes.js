import { Router } from 'express'
import { CompanyController } from '../controllers/company/company.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companySchema } from '../schemas/company.schema.js'

const router = Router()

router.post('/', validate(companySchema), CompanyController.create)

export default router
