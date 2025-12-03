import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import {
  createAccountingClientIntakeSchema,
  updateAccountingClientIntakeSchema,
} from '../schemas/monthlyAccounting.js'
import { StartActivitiesController } from '../controllers/invoices_and_accounting/startActivitiesController.js'

const router = Router()

router.get('/:companyId', StartActivitiesController.getAll)
router.post(
  '/:companyId',
  validate(createAccountingClientIntakeSchema),
  StartActivitiesController.create
)
router.put(
  '/:companyId',
  validate(updateAccountingClientIntakeSchema),
  StartActivitiesController.update
)

export default router
