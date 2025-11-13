import { Router } from 'express'
import { CommercialMovementController } from '../controllers/catalogs/commercialMovement.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { commercialMovementSchema } from '../schemas/commercialMovement.schema.js'

const router = Router()

router.get('/', CommercialMovementController.getAll)
router.get('/:id', CommercialMovementController.getById)
router.post(
  '/',
  validate(commercialMovementSchema),
  CommercialMovementController.create
)
router.put(
  '/:id',
  validate(commercialMovementSchema),
  CommercialMovementController.update
)
router.delete('/:id', CommercialMovementController.remove)

export default router
