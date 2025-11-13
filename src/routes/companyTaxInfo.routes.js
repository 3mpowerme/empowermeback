import { Router } from 'express'
import { CompanyTaxInfoController } from '../controllers/company/companyTaxInfo.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyTaxInfoSchema } from '../schemas/companyTaxInfo.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyTaxInfoSchema),
  CompanyTaxInfoController.create
)

router.get('/:companyId', CompanyTaxInfoController.getAll)

router.put('/', validate(companyTaxInfoSchema), CompanyTaxInfoController.update)

export default router
