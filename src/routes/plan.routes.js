import { Router } from 'express'
import { PlanController } from '../controllers/payment/plan.controller.js'

const router = Router()

router.get('/', PlanController.getPlans)

router.get('/:service_code', PlanController.getPlansByServiceCode)

export default router
