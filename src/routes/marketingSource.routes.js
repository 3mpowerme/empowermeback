import { Router } from 'express'
import { MarketingSourceController } from '../controllers/catalogs/marketingSource.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { marketingSourceSchema } from '../schemas/marketingSource.schema.js'

const router = Router()

router.get('/', MarketingSourceController.getAll)
router.get('/:id', MarketingSourceController.getById)
router.post(
  '/',
  validate(marketingSourceSchema),
  MarketingSourceController.create
)
router.put(
  '/:id',
  validate(marketingSourceSchema),
  MarketingSourceController.update
)
router.delete('/:id', MarketingSourceController.remove)

export default router
