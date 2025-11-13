import { Router } from 'express'
import { CompanyAuditInfoController } from '../controllers/company/companyAuditInfo.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyAuditInfoSchema } from '../schemas/companyAuditInfo.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyAuditInfoSchema),
  CompanyAuditInfoController.create
)

router.get('/:companyId', CompanyAuditInfoController.getAll)

router.put(
  '/',
  validate(companyAuditInfoSchema),
  CompanyAuditInfoController.update
)

export default router
