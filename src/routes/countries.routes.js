import { Router } from 'express'
import { CountriesController } from '../controllers/catalogs/countries.controller.js'

const router = Router()

router.get('/', CountriesController.getAll)

export default router
