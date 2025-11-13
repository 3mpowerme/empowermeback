import { Router } from 'express'
import { CompanyDissolutionOfSrlController } from '../controllers/company/companyDissolutionOfSrl.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyDissolutionOfSrlSchema } from '../schemas/companyDissolutionOfSrl.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyDissolutionOfSrlSchema),
  CompanyDissolutionOfSrlController.create
)

router.get('/:companyId', CompanyDissolutionOfSrlController.getAll)

router.put(
  '/',
  validate(companyDissolutionOfSrlSchema),
  CompanyDissolutionOfSrlController.update
)

export default router
