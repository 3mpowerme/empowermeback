import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { createShareholderRegistryIntakeSchema } from '../schemas/shareholderRegistryIntake.schema.js'
import { ShareholderRegistryIntakeController } from '../controllers/shareholderRegistryIntakeController.js'

const router = Router()

router.post(
  '/:companyId',
  validate(createShareholderRegistryIntakeSchema),
  ShareholderRegistryIntakeController.create
)

export default router
