import { Router } from 'express'
import { BuildCompanyController } from '../controllers/buildCompany/buildCompany.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { buildCompanySchema } from '../schemas/buildCompany.schema.js'

const router = Router()

router.post('/', validate(buildCompanySchema), BuildCompanyController.fillInfo)

router.get('/:companyId', BuildCompanyController.get)

router.put('/:companyId', BuildCompanyController.update)

export default router
