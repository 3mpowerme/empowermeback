import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { DissolutionCompanyIntakeController } from '../controllers/dissolutionCompanyIntakeController.js'
import { createDissolutionCompanyIntakeSchema } from '../schemas/dissolutionCompanyIntake.schema.js'

const router = Router()

router.post(
  '/:companyId/:serviceCode',
  validate(createDissolutionCompanyIntakeSchema),
  DissolutionCompanyIntakeController.create
)

export default router
