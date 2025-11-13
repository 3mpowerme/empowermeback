import { Router } from 'express'
import { CompanyBalanceInfoController } from '../controllers/company/companyBalanceInfo.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyBalanceInfoSchema } from '../schemas/companyBalanceInfo.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyBalanceInfoSchema),
  CompanyBalanceInfoController.create
)

router.get('/:companyId', CompanyBalanceInfoController.getAll)

router.put(
  '/',
  validate(companyBalanceInfoSchema),
  CompanyBalanceInfoController.update
)

export default router
