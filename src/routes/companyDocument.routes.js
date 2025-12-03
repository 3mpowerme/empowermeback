import { Router } from 'express'
import { CompanyDocumentController } from '../controllers/companyDocument.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createDocumentCommentSchema } from '../schemas/documentComment.schema.js'

const router = Router()

router.get(
  '/:companyId',

  CompanyDocumentController.list
)

router.get(
  '/:companyId/:documentId',

  CompanyDocumentController.getOne
)

router.get(
  '/:companyId/:documentId/comments',

  CompanyDocumentController.listComments
)

router.post(
  '/:companyId/:documentId/comments',

  validate(createDocumentCommentSchema),
  CompanyDocumentController.addComment
)

export default router
