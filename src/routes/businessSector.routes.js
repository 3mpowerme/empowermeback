import { Router } from 'express'
import { BusinessSectorController } from '../controllers/catalogs/businessSector.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { businessSectorSchema } from '../schemas/businessSector.schema.js'

const router = Router()

router.get('/', BusinessSectorController.getAll)
router.get('/:id', BusinessSectorController.getById)
router.post(
  '/',
  validate(businessSectorSchema),
  BusinessSectorController.create
)
router.put(
  '/:id',
  validate(businessSectorSchema),
  BusinessSectorController.update
)
router.delete('/:id', BusinessSectorController.remove)

export default router
