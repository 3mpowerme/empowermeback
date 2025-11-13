import { Router } from 'express'
import { ServiceDocumentController } from '../controllers/company/serviceDocument.controller.js'
import { updateServiceDocumentSchema } from '../schemas/serviceDocument.schema.js'
import { validate } from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/:serviceId/documents', ServiceDocumentController.list)

router.put(
  '/:serviceId/documents/:id',
  validate(updateServiceDocumentSchema),
  ServiceDocumentController.updateNoteOrUpload
)

router.post(
  '/:serviceId/documents/:id/upload-url',
  ServiceDocumentController.getUploadUrl
)

router.post(
  '/:serviceId/documents/:id/view-url',
  ServiceDocumentController.getViewUrl
)

export default router
