import { Router } from 'express'
import { CalendlyController } from '../controllers/external/calendly.controller.js'

const router = Router()

router.post('/', CalendlyController.create)

export default router
