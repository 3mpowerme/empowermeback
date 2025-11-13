import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { ServiceRequestController } from '../controllers/company/serviceRequest.controller.js'
import {
  serviceRequestSchema,
  updateServiceRequestStatusSchema,
} from '../schemas/serviceRequest.schema.js'

const router = Router()

router.get('/', ServiceRequestController.getAll)

router.put(
  '/status/:id',
  validate(updateServiceRequestStatusSchema),
  ServiceRequestController.updateStatus
)

router.post(
  '/',
  validate(serviceRequestSchema),
  ServiceRequestController.create
)

export default router
