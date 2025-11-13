import { Router } from 'express'
import { CompanyShareholderController } from '../controllers/company/companyShareholder.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyShareholderSchema } from '../schemas/companyShareholder.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyShareholderSchema),
  CompanyShareholderController.create
)

router.get('/:companyId', CompanyShareholderController.getAll)

router.put(
  '/:id',
  validate(companyShareholderSchema),
  CompanyShareholderController.update
)

router.delete('/:id', CompanyShareholderController.delete)

export default router
