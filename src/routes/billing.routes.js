import { Router } from 'express'
import { BillingController } from '../controllers/payment/billing.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  CreatePaymentIntentSchema,
  CreatePortalSchema,
  CreateServiceOrderSchema,
} from '../schemas/billing.schema.js'

const router = Router()

router.post(
  '/create-intent',
  validate(CreatePaymentIntentSchema),
  BillingController.createPaymentIntent
)

router.post(
  '/portal',
  validate(CreatePortalSchema),
  BillingController.createPortalSession
)

router.post(
  '/service-order',
  validate(CreateServiceOrderSchema),
  BillingController.createServiceOrder
)

export default router
