import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { PurchaseSaleIntakeController } from '../controllers/purchaseSaleIntakeController.js'
import { createPurchaseSaleIntakeSchema } from '../schemas/purchaseSaleIntake.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(createPurchaseSaleIntakeSchema),
  PurchaseSaleIntakeController.create
)

export default router
