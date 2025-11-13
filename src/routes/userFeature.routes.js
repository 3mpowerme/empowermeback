import { Router } from 'express'
import { UserFeatureController } from '../controllers/account/userFeature.controller.js'

const router = Router()

router.get('/', UserFeatureController.getAll)
router.get('/:id', UserFeatureController.getById)

export default router
