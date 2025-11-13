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

const router = Router()

router.get('/', ConceptualizationController.getAll)
router.post(
  '/brand-book-options',
  validate(brandBookOptionsSchema),
  ConceptualizationController.getBrandBookOptions
)
router.post(
  '/brand-book',
  validate(brandBookSchema),
  ConceptualizationController.createBrandBook
)

router.post(
  '/logo',
  validate(logoSchema),
  ConceptualizationController.createLogos
)

router.get(
  '/logo-history/:companyId',
  ConceptualizationController.getLogoHistory
)

router.post(
  '/',
  validate(conceptualizationSchema),
  ConceptualizationController.create
)
router.put(
  '/brand-book/:id',
  validate(updateBrandBookLogoSchema),
  ConceptualizationController.updateLogoBrandBook
)

router.post(
  '/business-plan/:id',
  validate(businessPlanSchema),
  ConceptualizationController.createBusinessPlan
)

router.post(
  '/business-card-mockups/:id',
  validate(businessPlanSchema),
  ConceptualizationController.createBusinessCardMockups
)

router.post(
  '/business-card-mockups/:id/update-chosen',
  validate(businessCardUpdateChosenSchema),
  ConceptualizationController.updateBusinessCardChosen
)

export default router
