import { Router } from 'express'
import { ConceptualizationController } from '../controllers/conceptualization/conceptualization.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { conceptualizationSchema } from '../schemas/conceptualization.schema.js'
import {
  brandBookOptionsSchema,
  brandBookSchema,
  businessPlanSchema,
  updateBrandBookLogoSchema,
  businessCardUpdateChosenSchema,
  logoSchema,
} from '../schemas/brandBook.schema.js'
import { iaSchema } from '../schemas/ia.schema.js'
import { IaController } from '../controllers/ia/ia.controller.js'

const router = Router()

router.post('/', validate(iaSchema), IaController.create)

export default router
