import { Router } from 'express'
import { CustomerServiceChannelController } from '../controllers/catalogs/customerServiceChannel.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { customerServiceChannelSchema } from '../schemas/customerServiceChannel.schema.js'

const router = Router()

router.get('/', CustomerServiceChannelController.getAll)
router.get('/:id', CustomerServiceChannelController.getById)
router.post(
  '/',
  validate(customerServiceChannelSchema),
  CustomerServiceChannelController.create
)
router.put(
  '/:id',
  validate(customerServiceChannelSchema),
  CustomerServiceChannelController.update
)
router.delete('/:id', CustomerServiceChannelController.remove)

export default router
