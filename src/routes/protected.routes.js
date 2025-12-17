import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import companyRoutes from '../routes/company.routes.js'
import accountRoutes from '../routes/account.routes.js'
import userFeatureRoutes from '../routes/userFeature.routes.js'
import companyMonthlyAccountingRequestRoutes from './companyMonthlyAccountingRequest.routes.js'
import companyMonthlyAccountingRequiredDocumentsRoutes from './companyMonthlyAccountingRequiredDocuments.routes.js'
import companyAuditInfoRoutes from '../routes/companyAuditInfo.routes.js'
import companyBalanceInfoRoutes from '../routes/companyBalanceInfo.routes.js'
import companyShareholderRoutes from '../routes/companyShareholder.routes.js'
import companyShareholdersRegistryRoutes from '../routes/companyShareholdersRegistry.routes.js'
import companyConstitutionReviewRoutes from '../routes/companyConstitutionReview.routes.js'
import companyDissolutionOfEirlRoutes from '../routes/companyDissolutionOfEirl.routes.js'
import companyDissolutionOfSpaRoutes from '../routes/companyDissolutionOfSpa.routes.js'
import companyDissolutionOfSrlRoutes from '../routes/companyDissolutionOfSrl.routes.js'
import companyTaxInfoRoutes from '../routes/companyTaxInfo.routes.js'
import legalRepresentativeRoutes from '../routes/legalRepresentative.routes.js'
import marketAnalysisRoutes from '../routes/marketAnalysis.routes.js'
import conceptualizationRoutes from '../routes/conceptualization.routes.js'
import serviceRequestRoutes from '../routes/serviceRequest.routes.js'
import appointmentRoutes from '../routes/appointment.routes.js'
import privateCalendlyRoutes from './privateCalendly.routes.js'
import subscriptionRoutes from './subscription.routes.js'
import billingRoutes from './billing.routes.js'
import planRoutes from './plan.routes.js'
import serviceDocumentsRoutes from './serviceDocuments.routes.js'
import protectedBuildCompanyRoutes from './protectedBuildCompany.routes.js'
import iaRoutes from './ia.routes.js'
import monthlyAccountingRoutes from './monthlyAccounting.routes.js'
import auditProcessIntakeRoutes from './auditProcessIntake.routes.js'
import balancePreparationIntakeRoutes from './balancePreparationIntake.routes.js'
import companyNotificationRoutes from './companyNotification.routes.js'
import companyDocumentRoutes from './companyDocument.routes.js'
import companyRegisteredServicesRoutes from './companyRegisteredServies.routes.js'
import dissolutionCompanyIntakeRoutes from './dissolutionCompanyIntake.routes.js'
import shareholderRegistryIntakeRoutes from './shareholderRegistry.routes.js'
import constitutionReviewIntakeRoutes from './constitutionReviewIntake.routes.js'
import virtualOfficeIntakeRoutes from './virtualOfficeIntake.routes.js'
import ordinaryShareholdersMeetingIntakeRoutes from './ordinaryShareholdersMeetingIntake.routes.js'

const router = Router()

router.use(authMiddleware)

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user,
  })
})

router.use('/company', companyRoutes)
router.use('/account', accountRoutes)
router.use('/user-feature', userFeatureRoutes)
router.use(
  '/company-monthly-accounting-request',
  companyMonthlyAccountingRequestRoutes
)
router.use(
  '/company-monthly-accounting-required-documents',
  companyMonthlyAccountingRequiredDocumentsRoutes
)
router.use('/company-shareholder', companyShareholderRoutes)
router.use(
  '/company-shareholders-registry-request',
  companyShareholdersRegistryRoutes
)
router.use(
  '/company-constitution-review-request',
  companyConstitutionReviewRoutes
)
router.use(
  '/company-dissolution-of-eirl-request',
  companyDissolutionOfEirlRoutes
)
router.use('/company-dissolution-of-spa-request', companyDissolutionOfSpaRoutes)
router.use('/company-dissolution-of-srl-request', companyDissolutionOfSrlRoutes)
router.use('/company-tax-info', companyTaxInfoRoutes)
router.use('/company-legal-representative', legalRepresentativeRoutes)
router.use('/market-analysis', marketAnalysisRoutes)
router.use('/conceptualization', conceptualizationRoutes)
router.use('/service-request', serviceRequestRoutes)
router.use('/appointment', appointmentRoutes)
router.use('/calendly', privateCalendlyRoutes)
router.use('/payments', billingRoutes)
router.use('/subscription', subscriptionRoutes)
router.use('/plan', planRoutes)
router.use('/services', serviceDocumentsRoutes)
router.use('/build-company', protectedBuildCompanyRoutes)
router.use('/ia', iaRoutes)

// invoices and accounting
router.use('/monthly-accounting', monthlyAccountingRoutes)
router.use('/company-audit-request', auditProcessIntakeRoutes)
router.use('/company-balance-request', balancePreparationIntakeRoutes)
// legal services
router.use('/dissolution-request', dissolutionCompanyIntakeRoutes)
router.use('/shareholders-registry-request', shareholderRegistryIntakeRoutes)
router.use('/constitution-review-request', constitutionReviewIntakeRoutes)
router.use('/virtual-office-request', virtualOfficeIntakeRoutes)
router.use(
  '/ordinary_shareholders_meeting-request',
  ordinaryShareholdersMeetingIntakeRoutes
)

router.use('/company-notifications', companyNotificationRoutes)
router.use('/company-documents', companyDocumentRoutes)
router.use('/company-registered-services', companyRegisteredServicesRoutes)

export default router
