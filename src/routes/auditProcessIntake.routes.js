import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { AuditProcessIntakeController } from '../controllers/invoices_and_accounting/auditProcessIntakeController.js'
import {
  createAuditProcessIntakeSchema,
  updateAuditProcessIntakeSchema,
} from '../schemas/auditProcessIntake.schema.js'

const router = Router()

router.get('/:companyId', AuditProcessIntakeController.getAll)
router.post(
  '/:companyId',
  validate(createAuditProcessIntakeSchema),
  AuditProcessIntakeController.create
)
router.put(
  '/:companyId',
  validate(updateAuditProcessIntakeSchema),
  AuditProcessIntakeController.update
)

export default router
