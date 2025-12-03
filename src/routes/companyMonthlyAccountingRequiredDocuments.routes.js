import { Router } from 'express'
import { CompanyMonthlyAccountingRequiredDocumentsController } from '../controllers/company/companyMonthlyAccountingRequiredDocuments.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyMonthlyAccountingRequiredDocumentsSchema } from '../schemas/companyMonthlyAccountingRequiredDocuments.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyMonthlyAccountingRequiredDocumentsSchema),
  CompanyMonthlyAccountingRequiredDocumentsController.create
)

router.get(
  '/:companyId',
  CompanyMonthlyAccountingRequiredDocumentsController.getAll
)

export default router
