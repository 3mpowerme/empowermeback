import { Router } from 'express'
import { CompanyRegisteredServicesController } from '../controllers/companyRegisteredServices.controller.js'

const router = Router()

router.get('/:companyId', CompanyRegisteredServicesController.list)

export default router
