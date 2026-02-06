import { Router } from 'express'
import { ServicesController } from '../controllers/executive/services.controller.js'

const router = Router()

router.get('/', ServicesController.get)
router.get('/executives/:serviceId', ServicesController.getExecutives)
router.get('/companies', ServicesController.getCompanies)
router.get('/users', ServicesController.getUsers)
router.get('/panel', ServicesController.getPanel)
router.get(
  '/services/:serviceId/companies/:companyId/intake',
  ServicesController.getInfoByServiceAndCompanyId
)
router.post('/notification', ServicesController.saveNotification)
router.put(
  '/:serviceOrderId/status',
  ServicesController.updateServiceOrderStatus
)

router.put('/:serviceOrderId/assigne', ServicesController.assigneServiceOrder)
router.get('/roles', ServicesController.getRoles)
router.post('/roles/:roleId', ServicesController.updateRoleByUserId)
router.get('/services/:userId', ServicesController.getServices)
router.put('/services/:userId', ServicesController.updateUserServicesByUser)

export default router
