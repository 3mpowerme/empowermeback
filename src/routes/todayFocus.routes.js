import { Router } from 'express'
import { TodayFocusController } from '../controllers/catalogs/todayFocus.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { todayFocusSchema } from '../schemas/todayFocus.schema.js'

const router = Router()

router.get('/', TodayFocusController.getAll)
router.get('/:id', TodayFocusController.getById)
router.post('/', validate(todayFocusSchema), TodayFocusController.create)
router.put('/:id', validate(todayFocusSchema), TodayFocusController.update)
router.delete('/:id', TodayFocusController.remove)

export default router
