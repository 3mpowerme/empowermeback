import { Router } from 'express'
import { AppointmentController } from '../controllers/company/appointment.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  appointmentSchema,
  updateAppointmentScheduledDateSchema,
  updateAppointmentStatusSchema,
} from '../schemas/appointment.schema.js'

const router = Router()

router.get('/:companyId', AppointmentController.getAll)

router.post('/', validate(appointmentSchema), AppointmentController.create)

router.put(
  '/status/:id',
  validate(updateAppointmentStatusSchema),
  AppointmentController.updateStatus
)
router.put(
  '/scheduled-date/:id',
  validate(updateAppointmentScheduledDateSchema),
  AppointmentController.updateScheduledDate
)

export default router
