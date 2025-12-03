import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { BalancePreparationIntakeController } from '../controllers/invoices_and_accounting/balancePreparationIntakeController.js'
import {
  createBalancePreparationIntakeSchema,
  updateBalancePreparationIntakeSchema,
} from '../schemas/balancePreparationIntake.schema.js'

const router = Router()

router.get('/:companyId', BalancePreparationIntakeController.getAll)
router.post(
  '/:companyId',
  validate(createBalancePreparationIntakeSchema),
  BalancePreparationIntakeController.create
)
router.put(
  '/:companyId/:id',
  validate(updateBalancePreparationIntakeSchema),
  BalancePreparationIntakeController.update
)

export default router
