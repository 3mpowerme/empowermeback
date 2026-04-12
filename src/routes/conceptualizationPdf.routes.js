import { Router } from 'express'
import { ConceptualizationPdfController } from '../controllers/conceptualization/conceptualizationPdf.controller.js'

const router = Router()

router.get('/:id/owned-detail', ConceptualizationPdfController.getOwnedConceptualization)
router.post('/:id/official-pdf/generate', ConceptualizationPdfController.generateOfficialPdf)
router.get('/:id/official-pdf', ConceptualizationPdfController.getOfficialPdf)
router.get('/:id/official-pdf/download-url', ConceptualizationPdfController.getOfficialPdfDownloadUrl)

export default router
