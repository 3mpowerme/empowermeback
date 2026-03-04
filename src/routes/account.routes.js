import { Router } from 'express'
import { AccountController } from '../controllers/account/account.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { updateProfileSchema } from '../schemas/user.schema.js'

const router = Router()

router.get('/', AccountController.getAll)
router.put('/profile', validate(updateProfileSchema), AccountController.updateProfile)
router.get('/:companyId', AccountController.getCompanySetupByCompanyId)
router.put('/:companyId', AccountController.update)

export default router
