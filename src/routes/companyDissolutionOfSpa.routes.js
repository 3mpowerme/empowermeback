import { Router } from 'express'
import { CompanyDissolutionOfSpaController } from '../controllers/company/companyDissolutionOfSpa.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyDissolutionOfSpaSchema } from '../schemas/companyDissolutionOfSpa.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyDissolutionOfSpaSchema),
  CompanyDissolutionOfSpaController.create
)

router.get('/:companyId', CompanyDissolutionOfSpaController.getAll)

router.put(
  '/',
  validate(companyDissolutionOfSpaSchema),
  CompanyDissolutionOfSpaController.update
)

export default router
