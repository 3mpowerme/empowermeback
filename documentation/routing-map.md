# routing-map

## App mounts (`src/app.js`)
- `app.use(webhookRoutes)` (registered before JSON parser).
- `app.use("/api", publicRoutes)`
- `app.use("/api", protectedRoutes)`

## public.routes.js mounts
- `/api/commercial-movements` -> `commercialMovement.routes.js`
- `/api/business-sectors` -> `businessSector.routes.js`
- `/api/today-focus` -> `todayFocus.routes.js`
- `/api/company-offering` -> `companyOffering.routes.js`
- `/api/customer-service-channel` -> `customerServiceChannel.routes.js`
- `/api/marketing-source` -> `marketingSource.routes.js`
- `/api/region` -> `region.routes.js`
- `/api/country` -> `countries.routes.js`
- `/api/feature` -> `feature.routes.js`
- `/api/auth` -> `auth.routes.js`
- `/api/offering-service-type` -> `offeringServiceType.routes.js`
- `/api/appointment-plan` -> `appointmentPlan.routes.js`
- `/api/webhook/calendly` -> `publicCalendly.routes.js`

## protected.routes.js mounts
- `/api/company` -> `company.routes.js`
- `/api/account` -> `account.routes.js`
- `/api/user-feature` -> `userFeature.routes.js`
- `/api/company-monthly-accounting-request` -> `companyMonthlyAccountingRequest.routes.js`
- `/api/company-monthly-accounting-required-documents` -> `companyMonthlyAccountingRequiredDocuments.routes.js`
- `/api/company-shareholder` -> `companyShareholder.routes.js`
- `/api/company-shareholders-registry-request` -> `companyShareholdersRegistry.routes.js`
- `/api/company-constitution-review-request` -> `companyConstitutionReview.routes.js`
- `/api/company-dissolution-of-eirl-request` -> `companyDissolutionOfEirl.routes.js`
- `/api/company-dissolution-of-spa-request` -> `companyDissolutionOfSpa.routes.js`
- `/api/company-dissolution-of-srl-request` -> `companyDissolutionOfSrl.routes.js`
- `/api/company-tax-info` -> `companyTaxInfo.routes.js`
- `/api/company-legal-representative` -> `legalRepresentative.routes.js`
- `/api/market-analysis` -> `marketAnalysis.routes.js`
- `/api/conceptualization` -> `conceptualization.routes.js`
- `/api/service-request` -> `serviceRequest.routes.js`
- `/api/appointment` -> `appointment.routes.js`
- `/api/calendly` -> `privateCalendly.routes.js`
- `/api/payments` -> `billing.routes.js`
- `/api/subscription` -> `subscription.routes.js`
- `/api/plan` -> `plan.routes.js`
- `/api/services` -> `serviceDocuments.routes.js`
- `/api/build-company` -> `protectedBuildCompany.routes.js`
- `/api/ia` -> `ia.routes.js`
- `/api/monthly-accounting` -> `monthlyAccounting.routes.js`
- `/api/company-start-activities-request` -> `startActivities.routes.js`
- `/api/company-audit-request` -> `auditProcessIntake.routes.js`
- `/api/company-balance-request` -> `balancePreparationIntake.routes.js`
- `/api/dissolution-request` -> `dissolutionCompanyIntake.routes.js`
- `/api/shareholders-registry-request` -> `shareholderRegistry.routes.js`
- `/api/constitution-review-request` -> `constitutionReviewIntake.routes.js`
- `/api/virtual-office-request` -> `virtualOfficeIntake.routes.js`
- `/api/ordinary_shareholders_meeting-request` -> `ordinaryShareholdersMeetingIntake.routes.js`
- `/api/company-modifications-request` -> `companyModificationsIntake.routes.js`
- `/api/purchase-sale-request` -> `purchaseSaleIntake.routes.js`
- `/api/company-notifications` -> `companyNotification.routes.js`
- `/api/company-documents` -> `companyDocument.routes.js`
- `/api/company-registered-services` -> `companyRegisteredServies.routes.js`
- `/api/executive` -> `executive.routes.js`
- `/api/intakes` -> `intakes.routes.js`