import { Router } from 'express'
import { CompanyNotificationController } from '../controllers/companyNotification.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createCompanyNotificationSchema } from '../schemas/companyNotification.schema.js'

const router = Router()

router.get('/:companyId', CompanyNotificationController.list)

router.post(
  '/:companyId',
  validate(createCompanyNotificationSchema),
  CompanyNotificationController.create
)

router.patch('/:companyId/:id/read', CompanyNotificationController.markAsRead)

router.patch(
  '/:companyId/read-all',
  CompanyNotificationController.markAllAsRead
)

export default router
