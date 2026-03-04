# EmpowerMe API Documentation

## Introduction
This documentation was created from real code inspection of backend route modules, middleware usage, and Joi schemas where route-level validation is applied.

## Organization
- One markdown file per mounted route module.
- `routing-map.md` explains route exposure under `/api`.
- `endpoint-inventory.md` is the coverage checklist for mounted endpoints.

## How to add new endpoints
1. Add/update route definitions in `src/routes/*.routes.js`.
2. Update controller/service/model logic.
3. Update `/documentation/<module>.md` using the same endpoint section template.
4. Update `endpoint-inventory.md` and this README table of contents.

## Table of contents

- [account.md](account.md)
- [appointment.md](appointment.md)
- [appointmentPlan.md](appointmentPlan.md)
- [auditProcessIntake.md](auditProcessIntake.md)
- [auth.md](auth.md)
- [balancePreparationIntake.md](balancePreparationIntake.md)
- [billing.md](billing.md)
- [businessSector.md](businessSector.md)
- [commercialMovement.md](commercialMovement.md)
- [company.md](company.md)
- [companyConstitutionReview.md](companyConstitutionReview.md)
- [companyDissolutionOfEirl.md](companyDissolutionOfEirl.md)
- [companyDissolutionOfSpa.md](companyDissolutionOfSpa.md)
- [companyDissolutionOfSrl.md](companyDissolutionOfSrl.md)
- [companyDocument.md](companyDocument.md)
- [companyModificationsIntake.md](companyModificationsIntake.md)
- [companyMonthlyAccountingRequest.md](companyMonthlyAccountingRequest.md)
- [companyMonthlyAccountingRequiredDocuments.md](companyMonthlyAccountingRequiredDocuments.md)
- [companyNotification.md](companyNotification.md)
- [companyOffering.md](companyOffering.md)
- [companyRegisteredServies.md](companyRegisteredServies.md)
- [companyShareholder.md](companyShareholder.md)
- [companyShareholdersRegistry.md](companyShareholdersRegistry.md)
- [companyTaxInfo.md](companyTaxInfo.md)
- [conceptualization.md](conceptualization.md)
- [constitutionReviewIntake.md](constitutionReviewIntake.md)
- [countries.md](countries.md)
- [customerServiceChannel.md](customerServiceChannel.md)
- [dissolutionCompanyIntake.md](dissolutionCompanyIntake.md)
- [endpoint-inventory.md](endpoint-inventory.md)
- [executive.md](executive.md)
- [feature.md](feature.md)
- [ia.md](ia.md)
- [intakes.md](intakes.md)
- [legalRepresentative.md](legalRepresentative.md)
- [marketAnalysis.md](marketAnalysis.md)
- [marketingSource.md](marketingSource.md)
- [monthlyAccounting.md](monthlyAccounting.md)
- [offeringServiceType.md](offeringServiceType.md)
- [ordinaryShareholdersMeetingIntake.md](ordinaryShareholdersMeetingIntake.md)
- [plan.md](plan.md)
- [privateCalendly.md](privateCalendly.md)
- [protected.md](protected.md)
- [protectedBuildCompany.md](protectedBuildCompany.md)
- [publicCalendly.md](publicCalendly.md)
- [purchaseSaleIntake.md](purchaseSaleIntake.md)
- [region.md](region.md)
- [routing-map.md](routing-map.md)
- [serviceDocuments.md](serviceDocuments.md)
- [serviceRequest.md](serviceRequest.md)
- [shareholderRegistry.md](shareholderRegistry.md)
- [startActivities.md](startActivities.md)
- [subscription.md](subscription.md)
- [todayFocus.md](todayFocus.md)
- [userFeature.md](userFeature.md)
- [virtualOfficeIntake.md](virtualOfficeIntake.md)
- [webhook.md](webhook.md)

## Coverage summary
- Total mounted endpoints documented: **178**