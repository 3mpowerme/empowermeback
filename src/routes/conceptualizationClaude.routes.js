import { Router } from 'express'
import { ConceptualizationClaudeController } from '../controllers/conceptualization/conceptualizationClaude.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { conceptualizationSchema } from '../schemas/conceptualization.schema.js'

const router = Router()

router.post(
  '/',
  validate(conceptualizationSchema),
  ConceptualizationClaudeController.create
)

export default router
