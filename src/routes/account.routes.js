import { Router } from 'express'
import { AccountController } from '../controllers/account/account.controller.js'

const router = Router()

router.get('/', AccountController.getAll)

export default router
