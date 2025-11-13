import { Router } from 'express'
import { CalendlyController } from '../controllers/external/calendly.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  calendlyEventDataSchema,
  calendlySchema,
} from '../schemas/calendly.schema.js'

const router = Router()

router.post(
  '/event-data',
  validate(calendlyEventDataSchema),
  CalendlyController.getById
)
router.get('/', CalendlyController.get)
router.delete('/:id', CalendlyController.remove)

export default router
