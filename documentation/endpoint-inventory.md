# endpoint-inventory

- Total mounted endpoints: **178**

## account.routes.js

- `GET /api/account/`
- `GET /api/account/:companyId`
- `PUT /api/account/:companyId`
## appointmentPlan.routes.js

- `GET /api/appointment-plan/`
- `GET /api/appointment-plan/:id`
## appointment.routes.js

- `POST /api/appointment/`
- `GET /api/appointment/:companyId`
- `PUT /api/appointment/scheduled-date/:id`
- `PUT /api/appointment/status/:id`
## auth.routes.js

- `POST /api/auth/forgot-password`
- `POST /api/auth/google`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/reset-password`
- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
## protectedBuildCompany.routes.js

- `POST /api/build-company/`
- `GET /api/build-company/:companyId`
- `PUT /api/build-company/:companyId`
## businessSector.routes.js

- `GET /api/business-sectors/`
- `POST /api/business-sectors/`
- `DELETE /api/business-sectors/:id`
- `GET /api/business-sectors/:id`
- `PUT /api/business-sectors/:id`
## privateCalendly.routes.js

- `GET /api/calendly/`
- `DELETE /api/calendly/:id`
- `POST /api/calendly/event-data`
## commercialMovement.routes.js

- `GET /api/commercial-movements/`
- `POST /api/commercial-movements/`
- `DELETE /api/commercial-movements/:id`
- `GET /api/commercial-movements/:id`
- `PUT /api/commercial-movements/:id`
## auditProcessIntake.routes.js

- `GET /api/company-audit-request/:companyId`
- `POST /api/company-audit-request/:companyId`
- `PUT /api/company-audit-request/:companyId`
## balancePreparationIntake.routes.js

- `GET /api/company-balance-request/:companyId`
- `POST /api/company-balance-request/:companyId`
- `PUT /api/company-balance-request/:companyId/:id`
## companyConstitutionReview.routes.js

- `PUT /api/company-constitution-review-request/`
- `GET /api/company-constitution-review-request/:companyId`
- `POST /api/company-constitution-review-request/:companyId`
## companyDissolutionOfEirl.routes.js

- `PUT /api/company-dissolution-of-eirl-request/`
- `GET /api/company-dissolution-of-eirl-request/:companyId`
- `POST /api/company-dissolution-of-eirl-request/:companyId`
## companyDissolutionOfSpa.routes.js

- `PUT /api/company-dissolution-of-spa-request/`
- `GET /api/company-dissolution-of-spa-request/:companyId`
- `POST /api/company-dissolution-of-spa-request/:companyId`
## companyDissolutionOfSrl.routes.js

- `PUT /api/company-dissolution-of-srl-request/`
- `GET /api/company-dissolution-of-srl-request/:companyId`
- `POST /api/company-dissolution-of-srl-request/:companyId`
## companyDocument.routes.js

- `GET /api/company-documents/:companyId/:serviceCode`
- `GET /api/company-documents/:companyId/:serviceCode/:documentId/comments`
- `POST /api/company-documents/:companyId/:serviceCode/:documentId/comments`
- `POST /api/company-documents/:companyId/:serviceCode/:documentId/view-url`
- `POST /api/company-documents/:companyId/:serviceCode/:isExecutive`
## legalRepresentative.routes.js

- `PUT /api/company-legal-representative/`
- `GET /api/company-legal-representative/:companyId`
- `POST /api/company-legal-representative/:companyId`
## companyModificationsIntake.routes.js

- `POST /api/company-modifications-request/:companyId/:serviceCode`
## companyMonthlyAccountingRequest.routes.js

- `PUT /api/company-monthly-accounting-request/`
- `GET /api/company-monthly-accounting-request/:companyId`
- `POST /api/company-monthly-accounting-request/:companyId`
## companyMonthlyAccountingRequiredDocuments.routes.js

- `GET /api/company-monthly-accounting-required-documents/:companyId`
- `POST /api/company-monthly-accounting-required-documents/:companyId`
## companyNotification.routes.js

- `GET /api/company-notifications/:companyId`
- `POST /api/company-notifications/:companyId`
- `PATCH /api/company-notifications/:companyId/:id/read`
- `PATCH /api/company-notifications/:companyId/read-all`
## companyOffering.routes.js

- `GET /api/company-offering/`
- `POST /api/company-offering/`
- `DELETE /api/company-offering/:id`
- `GET /api/company-offering/:id`
- `PUT /api/company-offering/:id`
## companyRegisteredServies.routes.js

- `GET /api/company-registered-services/:companyId`
## companyShareholder.routes.js

- `GET /api/company-shareholder/:companyId`
- `POST /api/company-shareholder/:companyId`
- `DELETE /api/company-shareholder/:id`
- `PUT /api/company-shareholder/:id`
## companyShareholdersRegistry.routes.js

- `PUT /api/company-shareholders-registry-request/`
- `GET /api/company-shareholders-registry-request/:companyId`
- `POST /api/company-shareholders-registry-request/:companyId`
## startActivities.routes.js

- `GET /api/company-start-activities-request/:companyId`
- `POST /api/company-start-activities-request/:companyId`
- `PUT /api/company-start-activities-request/:companyId`
## companyTaxInfo.routes.js

- `PUT /api/company-tax-info/`
- `GET /api/company-tax-info/:companyId`
- `POST /api/company-tax-info/:companyId`
## company.routes.js

- `POST /api/company/`
## conceptualization.routes.js

- `GET /api/conceptualization/`
- `POST /api/conceptualization/`
- `POST /api/conceptualization/brand-book`
- `POST /api/conceptualization/brand-book-options`
- `PUT /api/conceptualization/brand-book/:id`
- `POST /api/conceptualization/business-card-mockups/:id`
- `POST /api/conceptualization/business-card-mockups/:id/update-chosen`
- `POST /api/conceptualization/business-plan/:id`
- `POST /api/conceptualization/logo`
- `GET /api/conceptualization/logo-history/:companyId`
## constitutionReviewIntake.routes.js

- `POST /api/constitution-review-request/:companyId`
## countries.routes.js

- `GET /api/country/`
## customerServiceChannel.routes.js

- `GET /api/customer-service-channel/`
- `POST /api/customer-service-channel/`
- `DELETE /api/customer-service-channel/:id`
- `GET /api/customer-service-channel/:id`
- `PUT /api/customer-service-channel/:id`
## dissolutionCompanyIntake.routes.js

- `POST /api/dissolution-request/:companyId/:serviceCode`
## executive.routes.js

- `GET /api/executive/`
- `PUT /api/executive/:serviceOrderId/assigne`
- `PUT /api/executive/:serviceOrderId/status`
- `GET /api/executive/companies`
- `GET /api/executive/executives/:serviceId`
- `POST /api/executive/notification`
- `GET /api/executive/panel`
- `GET /api/executive/roles`
- `POST /api/executive/roles/:roleId`
- `GET /api/executive/services/:serviceId/companies/:companyId/intake`
- `GET /api/executive/services/:userId`
- `PUT /api/executive/services/:userId`
- `GET /api/executive/users`
## feature.routes.js

- `GET /api/feature/`
- `POST /api/feature/`
- `DELETE /api/feature/:id`
- `GET /api/feature/:id`
- `PUT /api/feature/:id`
## ia.routes.js

- `POST /api/ia/`
## intakes.routes.js

- `POST /api/intakes/:companyId/reuse-values`
- `GET /api/intakes/appointments/:companyId/:serviceCode`
- `POST /api/intakes/create-company`
- `GET /api/intakes/service/:serviceCode`
## marketAnalysis.routes.js

- `GET /api/market-analysis/`
## marketingSource.routes.js

- `GET /api/marketing-source/`
- `POST /api/marketing-source/`
- `DELETE /api/marketing-source/:id`
- `GET /api/marketing-source/:id`
- `PUT /api/marketing-source/:id`
## protected.routes.js

- `GET /api/me`
## monthlyAccounting.routes.js

- `GET /api/monthly-accounting/:companyId`
- `POST /api/monthly-accounting/:companyId`
- `PUT /api/monthly-accounting/:companyId`
## offeringServiceType.routes.js

- `GET /api/offering-service-type/`
- `POST /api/offering-service-type/`
- `DELETE /api/offering-service-type/:id`
- `GET /api/offering-service-type/:id`
- `PUT /api/offering-service-type/:id`
## ordinaryShareholdersMeetingIntake.routes.js

- `POST /api/ordinary_shareholders_meeting-request/:companyId`
## billing.routes.js

- `POST /api/payments/create-intent`
- `POST /api/payments/portal`
- `POST /api/payments/service-order`
## plan.routes.js

- `GET /api/plan/`
- `GET /api/plan/:service_code`
## purchaseSaleIntake.routes.js

- `POST /api/purchase-sale-request/:companyId`
## region.routes.js

- `GET /api/region/`
- `POST /api/region/`
- `DELETE /api/region/:id`
- `GET /api/region/:id`
- `PUT /api/region/:id`
## serviceRequest.routes.js

- `GET /api/service-request/`
- `POST /api/service-request/`
- `PUT /api/service-request/status/:id`
## serviceDocuments.routes.js

- `GET /api/services/:serviceId/documents`
- `POST /api/services/:serviceId/documents/:companyId/upload-url`
- `PUT /api/services/:serviceId/documents/:id`
- `POST /api/services/:serviceId/documents/:id/view-url`
## shareholderRegistry.routes.js

- `POST /api/shareholders-registry-request/:companyId`
## subscription.routes.js

- `POST /api/subscription/`
- `GET /api/subscription/:companyId`
- `POST /api/subscription/:id/cancel`
## todayFocus.routes.js

- `GET /api/today-focus/`
- `POST /api/today-focus/`
- `DELETE /api/today-focus/:id`
- `GET /api/today-focus/:id`
- `PUT /api/today-focus/:id`
## userFeature.routes.js

- `GET /api/user-feature/`
- `GET /api/user-feature/:id`
## virtualOfficeIntake.routes.js

- `POST /api/virtual-office-request/:companyId/:serviceCode`
## publicCalendly.routes.js

- `POST /api/webhook/calendly/`
## webhook.routes.js

- `POST /api/webhook/stripe`