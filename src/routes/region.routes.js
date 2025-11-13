import { Router } from 'express'
import { RegionController } from '../controllers/catalogs/region.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { regionSchema } from '../schemas/region.schema.js'

const router = Router()

router.get('/', RegionController.getAll)
router.get('/:id', RegionController.getById)
router.post('/', validate(regionSchema), RegionController.create)
router.put('/:id', validate(regionSchema), RegionController.update)
router.delete('/:id', RegionController.remove)

export default router
