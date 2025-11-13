import { Router } from 'express'
import { LegalRepresentativeController } from '../controllers/company/legalRepresentative.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { legalRepresentativeSchema } from '../schemas/legalRepresentative.schema.js'

const router = Router()

router.post(
  '/:companyId',
  validate(legalRepresentativeSchema),
  LegalRepresentativeController.create
)

router.get('/:companyId', LegalRepresentativeController.getAll)

router.put(
  '/',
  validate(legalRepresentativeSchema),
  LegalRepresentativeController.update
)

export default router
