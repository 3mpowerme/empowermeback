import { Router } from 'express'
import { CompanyMonthlyAccountingRequestController } from '../controllers/company/companyMonthlyAccountingRequest.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyMonthlyAccountingRequestSchema } from '../schemas/companyMonthlyAccountingRequest.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyMonthlyAccountingRequestSchema),
  CompanyMonthlyAccountingRequestController.create
)

router.get('/:companyId', CompanyMonthlyAccountingRequestController.getAll)

router.put(
  '/',
  validate(companyMonthlyAccountingRequestSchema),
  CompanyMonthlyAccountingRequestController.update
)

export default router
