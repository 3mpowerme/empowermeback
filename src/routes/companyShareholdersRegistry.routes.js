import { Router } from 'express'
import { CompanyShareholdersRegistryController } from '../controllers/company/companyShareholdersRegistry.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyShareholdersRegistrySchema } from '../schemas/companyShareholdersRegistry.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(companyShareholdersRegistrySchema),
  CompanyShareholdersRegistryController.create
)

router.get('/:companyId', CompanyShareholdersRegistryController.getAll)

router.put(
  '/',
  validate(companyShareholdersRegistrySchema),
  CompanyShareholdersRegistryController.update
)

export default router
