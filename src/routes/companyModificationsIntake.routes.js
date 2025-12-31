import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { CompanyModificationsIntakeController } from '../controllers/companyModificationsIntakeController.js'
import { createCompanyModificationsIntakeSchema } from '../schemas/companyModificationsIntake.schema.js'

const router = Router()

router.post(
  '/:companyId/:serviceCode',
  validate(createCompanyModificationsIntakeSchema),
  CompanyModificationsIntakeController.create
)

export default router
