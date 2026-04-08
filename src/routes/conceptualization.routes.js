import { Router } from 'express'
import { ConceptualizationController } from '../controllers/conceptualization/conceptualization.controller.js'
import { ConceptualizationClaudeController } from '../controllers/conceptualization/conceptualizationClaude.controller.js'
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
  ConceptualizationController.createBrandBookGemini
)
router.post(
  '/brand-book-gemini',
  validate(brandBookSchema),
  ConceptualizationController.createBrandBookGemini
)

router.post(
  '/logo',
  validate(logoSchema),
  ConceptualizationController.createLogosGemini
)
router.post(
  '/logo-gemini',
  validate(logoSchema),
  ConceptualizationController.createLogosGemini
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
  ConceptualizationController.createBusinessCardMockupsGemini
)
router.post(
  '/business-card-mockups-gemini/:id',
  validate(businessPlanSchema),
  ConceptualizationController.createBusinessCardMockupsGemini
)

router.post(
  '/business-card-mockups/:id/update-chosen',
  validate(businessCardUpdateChosenSchema),
  ConceptualizationController.updateBusinessCardChosen
)

export default router
