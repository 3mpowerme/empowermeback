import { Router } from 'express'
import { CompanyOfferingController } from '../controllers/catalogs/companyOffering.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { companyOfferingSchema } from '../schemas/companyOffering.schema.js'

const router = Router()

router.get('/', CompanyOfferingController.getAll)
router.get('/:id', CompanyOfferingController.getById)
router.post(
  '/',
  validate(companyOfferingSchema),
  CompanyOfferingController.create
)
router.put(
  '/:id',
  validate(companyOfferingSchema),
  CompanyOfferingController.update
)
router.delete('/:id', CompanyOfferingController.remove)

export default router
