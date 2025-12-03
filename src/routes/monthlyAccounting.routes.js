import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { AccountingClientIntakeController } from '../controllers/invoices_and_accounting/monthlyAccounting.controller.js'
import {
  createAccountingClientIntakeSchema,
  updateAccountingClientIntakeSchema,
} from '../schemas/monthlyAccounting.js'

const router = Router()

router.get('/:companyId', AccountingClientIntakeController.getAll)
router.post(
  '/:companyId',
  validate(createAccountingClientIntakeSchema),
  AccountingClientIntakeController.create
)
router.put(
  '/:companyId',
  validate(updateAccountingClientIntakeSchema),
  AccountingClientIntakeController.update
)

export default router
