import { Router } from 'express'
import multer from 'multer'
import { CompanyDocumentController } from '../controllers/companyDocument.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createDocumentCommentSchema } from '../schemas/documentComment.schema.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
})

router.get('/:companyId/:serviceCode', CompanyDocumentController.list)
router.post(
  '/:companyId/:serviceCode',
  upload.single('file'),
  CompanyDocumentController.upload
)

router.post(
  '/:companyId/:serviceCode/:documentId/view-url',
  CompanyDocumentController.getViewUrl
)

router.get(
  '/:companyId/:serviceCode/:documentId/comments',
  CompanyDocumentController.listComments
)
router.post(
  '/:companyId/:serviceCode/:documentId/comments',
  validate(createDocumentCommentSchema),
  CompanyDocumentController.addComment
)

export default router
