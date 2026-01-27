import { Router } from 'express'
import { IntakesController } from '../controllers/intakes/intakes.controller.js'

const router = Router()

router.post(
  '/:companyId/reuse-values',
  IntakesController.getReusableIntakeValuesByCompanyId
)

router.post('/create-company', IntakesController.createCompany)
router.get('/service/:serviceCode', IntakesController.getServiceInfo)
router.get(
  '/appointments/:companyId/:serviceCode',
  IntakesController.getAppointmentsByServiceCode
)

export default router
