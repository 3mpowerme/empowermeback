import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { createVirtualOfficeContractIntakeSchema } from '../schemas/virtualOfficeIntake.schema.js'
import { VirtualOfficeIntakeController } from '../controllers/virtualOfficeIntakeController.js'

const router = Router()

router.post(
  '/:companyId/:serviceCode',
  validate(createVirtualOfficeContractIntakeSchema),
  VirtualOfficeIntakeController.create
)

export default router
