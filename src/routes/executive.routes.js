import { Router } from 'express'
import { ServicesController } from '../controllers/executive/services.controller.js'

const router = Router()

router.get('/', ServicesController.get)
router.get('/companies', ServicesController.getCompanies)
router.get('/panel', ServicesController.getPanel)
router.get(
  '/services/:serviceId/companies/:companyId/intake',
  ServicesController.getInfoByServiceAndCompanyId
)
router.post('/notification', ServicesController.saveNotification)

export default router
