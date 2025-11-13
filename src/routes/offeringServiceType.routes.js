import { Router } from 'express'
import { OfferingServiceTypeController } from '../controllers/catalogs/offeringServiceType.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { offeringServiceTypeSchema } from '../schemas/offeringServiceType.schema.js'

const router = Router()

router.get('/', OfferingServiceTypeController.getAll)
router.get('/:id', OfferingServiceTypeController.getById)
router.post(
  '/',
  validate(offeringServiceTypeSchema),
  OfferingServiceTypeController.create
)
router.put(
  '/:id',
  validate(offeringServiceTypeSchema),
  OfferingServiceTypeController.update
)
router.delete('/:id', OfferingServiceTypeController.remove)

export default router
