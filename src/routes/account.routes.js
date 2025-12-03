import { Router } from 'express'
import { AccountController } from '../controllers/account/account.controller.js'

const router = Router()

router.get('/', AccountController.getAll)
router.get('/:companyId', AccountController.getCompanySetupByCompanyId)
router.put('/:companyId', AccountController.update)

export default router
