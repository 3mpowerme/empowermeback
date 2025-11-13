import { Router } from 'express'
import { SubscriptionsController } from '../controllers/payment/subscription.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  CreateSubscriptionSchema,
  CancelSubscriptionSchema,
} from '../schemas/billing.schema.js'

const router = Router()

router.post(
  '/',
  validate(CreateSubscriptionSchema),
  SubscriptionsController.create
)
router.get('/:companyId', SubscriptionsController.listActive)
router.post(
  '/:id/cancel',
  validate(CancelSubscriptionSchema),
  SubscriptionsController.cancel
)

export default router
