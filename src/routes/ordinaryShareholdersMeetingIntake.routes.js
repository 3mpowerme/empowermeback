import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { createOrdinaryShareholdersMeetingIntakeSchema } from '../schemas/ordinaryShareholdersMeetingIntake.schema.js'
import { OrdinaryShareholdersMeetingIntakeController } from '../controllers/ordinaryShareholdersMeetingIntakeController.js'

const router = Router()

router.post(
  '/:companyId',
  validate(createOrdinaryShareholdersMeetingIntakeSchema),
  OrdinaryShareholdersMeetingIntakeController.create
)

export default router
