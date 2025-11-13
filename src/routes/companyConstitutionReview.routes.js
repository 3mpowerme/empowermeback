import { Router } from 'express'
import { ConstitutionReviewRegistryController } from '../controllers/company/companyConstitutionReview.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyConstitutionReviewSchema } from '../schemas/companyConstitutionReview.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyConstitutionReviewSchema),
  ConstitutionReviewRegistryController.create
)

router.get('/:companyId', ConstitutionReviewRegistryController.getAll)

router.put(
  '/',
  validate(companyConstitutionReviewSchema),
  ConstitutionReviewRegistryController.update
)

export default router
