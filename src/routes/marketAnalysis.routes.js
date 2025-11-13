import { Router } from 'express'
import { MarketAnalysisController } from '../controllers/conceptualization/marketAnalysis.controller.js'

const router = Router()

router.get('/', MarketAnalysisController.get)

export default router
