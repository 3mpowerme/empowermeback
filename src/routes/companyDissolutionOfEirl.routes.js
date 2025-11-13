import { Router } from 'express'
import { CompanyDissolutionOfEirlController } from '../controllers/company/companyDissolutionOfEirl.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyDissolutionOfEirlSchema } from '../schemas/companyDissolutionOfEirl.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyDissolutionOfEirlSchema),
  CompanyDissolutionOfEirlController.create
)

router.get('/:companyId', CompanyDissolutionOfEirlController.getAll)

router.put(
  '/',
  validate(companyDissolutionOfEirlSchema),
  CompanyDissolutionOfEirlController.update
)

export default router
