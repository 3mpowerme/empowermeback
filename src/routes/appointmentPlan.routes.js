import { Router } from 'express'
import { AppointmentPlanController } from '../controllers/catalogs/appointmentPlan.controller.js'

const router = Router()

router.get('/', AppointmentPlanController.getAll)
router.get('/:id', AppointmentPlanController.getById)

export default router
