import { Router } from 'express'
import businessSectorRoutes from './businessSector.routes.js'
import todayFocusRoutes from './todayFocus.routes.js'
import companyOfferingRoutes from './companyOffering.routes.js'
import customerServiceChannelRoutes from './customerServiceChannel.routes.js'
import marketingSourceRoutes from './marketingSource.routes.js'
import regionRoutes from './region.routes.js'
import featureRoutes from './feature.routes.js'
import publicBuildCompanyRoutes from './publicBuildCompany.routes.js'
import commercialMovementRoutes from './commercialMovement.routes.js'
import authRoutes from './auth.routes.js'
import offeringServiceTypeRoutes from './offeringServiceType.routes.js'
import appointmentPlanRoutes from './appointmentPlan.routes.js'
import publicCalendlyRoutes from './publicCalendly.routes.js'

const router = Router()

router.use('/commercial-movements', commercialMovementRoutes)
router.use('/business-sectors', businessSectorRoutes)
router.use('/today-focus', todayFocusRoutes)
router.use('/company-offering', companyOfferingRoutes)
router.use('/customer-service-channel', customerServiceChannelRoutes)
router.use('/marketing-source', marketingSourceRoutes)
router.use('/region', regionRoutes)
router.use('/feature', featureRoutes)
router.use('/build-company', publicBuildCompanyRoutes)
router.use('/auth', authRoutes)
router.use('/offering-service-type', offeringServiceTypeRoutes)
router.use('/appointment-plan', appointmentPlanRoutes)
router.use('/webhook/calendly', publicCalendlyRoutes)

export default router
