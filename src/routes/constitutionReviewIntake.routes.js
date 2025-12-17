import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { createConstitutionReviewIntakeSchema } from '../schemas/constitutionReviewIntake.schema.js'
import { ConstitutionReviewIntakeController } from '../controllers/constitutionReviewIntakeController.js'

const router = Router()

router.post(
  '/:companyId',
  validate(createConstitutionReviewIntakeSchema),
  ConstitutionReviewIntakeController.create
)

export default router
