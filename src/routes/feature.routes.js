import { Router } from 'express'
import { FeatureController } from '../controllers/catalogs/feature.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { featureSchema } from '../schemas/feature.schema.js'

const router = Router()

router.get('/', FeatureController.getAll)
router.get('/:id', FeatureController.getById)
router.post('/', validate(featureSchema), FeatureController.create)
router.put('/:id', validate(featureSchema), FeatureController.update)
router.delete('/:id', FeatureController.remove)

export default router
