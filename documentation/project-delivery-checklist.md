# EmpowerMe Project Delivery Checklist

_Last updated: 2026-03-10_

## Table of Contents

1. [Purpose and Scope](#purpose-and-scope)
2. [Global Architecture Snapshot](#global-architecture-snapshot)
3. [Delivery Validation Checklist](#delivery-validation-checklist)
4. [Module: Authentication & Access Control](#module-authentication--access-control)
5. [Module: Company Onboarding (Build Company)](#module-company-onboarding-build-company)
6. [Module: Company Core Profile](#module-company-core-profile)
7. [Module: Services, Plans, Subscriptions & Billing](#module-services-plans-subscriptions--billing)
8. [Module: Service Requests & Legal/Accounting Intakes](#module-service-requests--legalaccounting-intakes)
9. [Module: Appointments & Calendly](#module-appointments--calendly)
10. [Module: Notifications & Communication](#module-notifications--communication)
11. [Module: User Account, Roles & Feature Access](#module-user-account-roles--feature-access)
12. [Module: AI, Conceptualization & Market Analysis](#module-ai-conceptualization--market-analysis)
13. [Module: Landing & Lead Acquisition](#module-landing--lead-acquisition)
14. [Module: Database & Automation Assets](#module-database--automation-assets)
15. [Cross-Module Security Considerations](#cross-module-security-considerations)
16. [Final Client Reception Checklist](#final-client-reception-checklist)

---

## Purpose and Scope

This document provides a full and detailed delivery checklist for EmpowerMe, covering:

- Landing application (`empowermelanding`)
- Frontend application (`empowermefront`)
- Backend API (`empowermeback`)
- Database and automation assets (`dev_androide_17`)

It is designed for client reception validation and internal technical sign-off.

---

## Global Architecture Snapshot

EmpowerMe is structured as a multi-repo product:

- **Landing app** for acquisition and first-contact conversion.
- **Frontend app** for authenticated product usage and workflows.
- **Backend API** as the domain/business logic layer.
- **SQL/automation repository** for persistence assets and operational support.

Core integrations observed:

- AWS Cognito (authentication)
- Stripe (payments/subscription)
- Calendly (scheduling)
- Email/webhook providers

---

## Delivery Validation Checklist

- [x] Functional inventory includes all major product domains.
- [x] Backend module documentation aligned with route-level APIs.
- [x] Frontend and landing responsibilities documented.
- [x] Data and persistence layer documented.
- [x] Security, validation, and edge cases captured.
- [x] Document available in English and Spanish.

---

# Module: Authentication & Access Control

## 1. Overview
This module manages user identity lifecycle: registration, login, verification, password recovery, token-based session continuity, and protected route access.

## 2. Business Purpose
Allow secure access to EmpowerMe features and ensure users only access authorized sections.

## 3. Module Responsibilities
- Register users
- Verify user identity
- Authenticate credentials / federated identity
- Handle password recovery
- Guard frontend routes and backend endpoints

## 4. System Dependencies
### Internal dependencies
- Users/Account module
- Feature access module
- Protected API middleware

### External dependencies
- AWS Cognito

## 5. Database Tables
Likely user/session-related entities in main SQL schema.

## 6. Backend Structure
- `routes/auth.routes.js`
- `controllers/*auth*`
- `services/*auth*`
- validation and middleware in auth/protected flow

## 7. API Endpoints
- `/api/auth/*`
- `/api/me` (protected identity resolution)

## 8. Frontend Components
- `features/Auth/LoginPage.jsx`
- `features/Auth/SignUpPage.jsx`
- `features/Auth/ForgotPasswordPage.jsx`
- `features/Auth/ConfirmForgotPasswordPage.jsx`
- `features/Auth/VerifyEmailPage.jsx`
- `features/Auth/CallbackPage.jsx`

## 9. User Flows
Signup/Login -> token/session -> protected navigation -> logout/session expiry.

## 10. Data Flow
Frontend auth form -> backend auth endpoint -> identity provider -> backend response -> frontend session state.

## 11. Validations
Frontend required fields and format checks; backend schema and auth checks.

## 12. Security Considerations
Auth required in protected endpoints, token validation, role checks in guarded routes.

## 13. Edge Cases
Invalid credentials, expired tokens, duplicated account, unverified user.

---

# Module: Company Onboarding (Build Company)

## 1. Overview
Wizard-based onboarding for company creation/configuration.

## 2. Business Purpose
Reduce friction for new organizations and convert registration into an operational account.

## 3. Module Responsibilities
- Collect initial business data
- Validate onboarding steps
- Persist company setup
- Link user and organization context

## 4. System Dependencies
### Internal dependencies
- Company module
- Catalog modules (country/region/sector)
- Intakes and tax/legal profile modules

### External dependencies
- Cognito (identity)

## 5. Database Tables
Uses company and related profile/config tables in SQL schema.

## 6. Backend Structure
- `routes/protectedBuildCompany.routes.js`
- `routes/publicBuildCompany.routes.js`
- company-related controllers/services/models/schemas

## 7. API Endpoints
- `/api/build-company/*`
- company creation/update endpoints

## 8. Frontend Components
- `features/BuildCompany/BuildCompanyWizardPage.jsx`
- related wizard components/hooks

## 9. User Flows
User starts wizard -> enters business data -> validations -> company created -> dashboard access.

## 10. Data Flow
Wizard step data -> API -> business service -> DB persistence -> completion response.

## 11. Validations
Step-level required fields, country/region coherence, duplication prevention.

## 12. Security Considerations
Authenticated writes, company ownership linkage, payload validation.

## 13. Edge Cases
Partial wizard completion, duplicate company attempts, invalid legal/tax combinations.

---

# Module: Company Core Profile

## 1. Overview
Manages company entity and related legal/tax/shareholder sub-domains.

## 2. Business Purpose
Centralize the legal and operational profile required for service fulfillment.

## 3. Module Responsibilities
- Create/update company profile
- Maintain legal representative and shareholder data
- Manage tax/accounting identity fields

## 4. System Dependencies
### Internal dependencies
- countries/regions
- legal representative
- shareholders registry
- tax info

### External dependencies
- None mandatory for core persistence

## 5. Database Tables
- `companies`
- shareholder/legal/tax related tables (as defined in SQL script)

## 6. Backend Structure
- `routes/company.routes.js`
- `routes/companyTaxInfo.routes.js`
- `routes/companyShareholder.routes.js`
- `routes/legalRepresentative.routes.js`

## 7. API Endpoints
- `/api/company/*`
- `/api/company-tax-info/*`
- `/api/company-shareholder/*`
- `/api/company-legal-representative/*`

## 8. Frontend Components
Dashboard company/account-related pages and forms.

## 9. User Flows
Company admin edits profile -> backend validates -> changes persisted -> profile reflected in dashboard.

## 10. Data Flow
Frontend company form -> API -> service/model -> DB -> updated profile response.

## 11. Validations
Required profile fields, identifier formats, duplication checks.

## 12. Security Considerations
Role-based restrictions and ownership checks for write operations.

## 13. Edge Cases
Conflicting updates, invalid representative records, incomplete shareholder data.

---

# Module: Services, Plans, Subscriptions & Billing

## 1. Overview
Controls service catalog visibility, plan assignment, subscriptions, and payment intents.

## 2. Business Purpose
Monetize platform services and manage client subscription lifecycle.

## 3. Module Responsibilities
- Expose service/feature catalog
- Handle subscription operations
- Process payment intents and payment confirmation

## 4. System Dependencies
### Internal dependencies
- company offering and service request modules
- account/user feature modules

### External dependencies
- Stripe

## 5. Database Tables
Plan/subscription/payment entities in SQL schema.

## 6. Backend Structure
- `routes/plan.routes.js`
- `routes/subscription.routes.js`
- `routes/billing.routes.js`
- `routes/companyOffering.routes.js`

## 7. API Endpoints
- `/api/plan/*`
- `/api/subscription/*`
- `/api/payments/*`

## 8. Frontend Components
Billing/subscription UI and service purchase/activation views in dashboard.

## 9. User Flows
Select plan/service -> create payment intent -> confirm payment -> enable subscription.

## 10. Data Flow
Frontend checkout -> billing endpoint -> Stripe -> webhook/status update -> account entitlement update.

## 11. Validations
Plan eligibility, amount consistency, payment state checks.

## 12. Security Considerations
Webhook verification, protected billing operations, payment data handling.

## 13. Edge Cases
Failed payments, duplicated webhook events, canceled subscriptions.

---

# Module: Service Requests & Legal/Accounting Intakes

## 1. Overview
Domain layer for legal/accounting service requests and intake workflows.

## 2. Business Purpose
Convert client needs into actionable service requests with required data/documents.

## 3. Module Responsibilities
- Create and track intake records
- Validate service-specific payloads
- Support legal/accounting process variants

## 4. System Dependencies
### Internal dependencies
- Company profile modules
- Service documents module
- Notification module

### External dependencies
- Optional file/email integrations

## 5. Database Tables
Service request and intake-specific tables in SQL schema.

## 6. Backend Structure
Representative routes include:
- `serviceRequest.routes.js`
- `serviceDocuments.routes.js`
- `monthlyAccounting.routes.js`
- `constitutionReviewIntake.routes.js`
- `virtualOfficeIntake.routes.js`
- `purchaseSaleIntake.routes.js`
- and other intake-specific route files.

## 7. API Endpoints
`/api/*request*`, `/api/services/*/documents`, and intake-specific namespaces.

## 8. Frontend Components
Dashboard legal/tax/accounting service pages and request forms.

## 9. User Flows
User selects service -> submits intake -> system validates/stores -> status updates shown.

## 10. Data Flow
Frontend intake form -> endpoint -> validation schema -> service logic -> DB -> notification/response.

## 11. Validations
Service-code coherence, required documentation, per-service business rules.

## 12. Security Considerations
Authenticated operations and strict input/schema validation.

## 13. Edge Cases
Incomplete intake payloads, invalid service code, duplicate requests.

---

# Module: Appointments & Calendly

## 1. Overview
Scheduling layer for private/public appointments and event synchronization.

## 2. Business Purpose
Enable client booking and service-team scheduling coordination.

## 3. Module Responsibilities
- Expose scheduling endpoints
- Process Calendly events
- Link appointments with companies/users

## 4. System Dependencies
### Internal dependencies
- account/company modules
- notifications

### External dependencies
- Calendly

## 5. Database Tables
Appointment and appointment-plan related tables.

## 6. Backend Structure
- `appointment.routes.js`
- `appointmentPlan.routes.js`
- `privateCalendly.routes.js`
- `publicCalendly.routes.js`

## 7. API Endpoints
`/api/appointment*`, `/api/calendly/*`, `/api/webhook/calendly/*`.

## 8. Frontend Components
Appointments page and calendly/booking widgets.

## 9. User Flows
User selects slot -> scheduling confirmation -> webhook updates status.

## 10. Data Flow
Frontend booking action -> backend scheduling endpoint -> Calendly -> webhook callback -> persistence.

## 11. Validations
Date/time windows, ownership/authorization, duplicate-event handling.

## 12. Security Considerations
Webhook source validation and protected private scheduling endpoints.

## 13. Edge Cases
Double booking, canceled events, delayed webhooks.

---

# Module: Notifications & Communication

## 1. Overview
Handles user/company notifications and communication channels.

## 2. Business Purpose
Keep users informed about request states, milestones, and actions needed.

## 3. Module Responsibilities
- Provide notification feeds
- Track communication channels/preferences
- Trigger event-based communication

## 4. System Dependencies
### Internal dependencies
- service request and appointment modules

### External dependencies
- Email/notification provider(s)

## 5. Database Tables
Notification and channel preference tables.

## 6. Backend Structure
- `companyNotification.routes.js`
- `customerServiceChannel.routes.js`

## 7. API Endpoints
- `/api/company-notifications/*`
- `/api/customer-service-channel/*`

## 8. Frontend Components
Notifications dashboard views and interaction components.

## 9. User Flows
Business event occurs -> notification created -> user sees updates in dashboard.

## 10. Data Flow
Domain event -> notification service -> DB -> frontend retrieval endpoint.

## 11. Validations
Recipient ownership and notification state validity.

## 12. Security Considerations
Only authorized users can view company-level notifications.

## 13. Edge Cases
Unread/read state desync, missing recipients, duplicate notifications.

---

# Module: User Account, Roles & Feature Access

## 1. Overview
Defines user profile data, role permissions, and feature-level authorization.

## 2. Business Purpose
Allow differentiated access by user role and subscription/service context.

## 3. Module Responsibilities
- Provide account data
- Enforce role checks
- Resolve feature availability

## 4. System Dependencies
### Internal dependencies
- auth module
- plan/subscription modules

### External dependencies
- identity provider (Cognito)

## 5. Database Tables
User-account, role and feature-mapping tables.

## 6. Backend Structure
- `account.routes.js`
- `feature.routes.js`
- `userFeature.routes.js`
- `executive.routes.js`

## 7. API Endpoints
- `/api/account/*`
- `/api/feature/*`
- `/api/user-feature/*`

## 8. Frontend Components
- Account page
- RoleGuard logic and protected navigation

## 9. User Flows
User logs in -> profile and features loaded -> UI capabilities gated by role/features.

## 10. Data Flow
Auth context -> account/feature endpoints -> frontend route/component gating.

## 11. Validations
Role consistency checks and protected endpoint authorization.

## 12. Security Considerations
RBAC enforcement at backend and route guard in frontend.

## 13. Edge Cases
Role drift, stale permission cache, blocked access to newly granted features.

---

# Module: AI, Conceptualization & Market Analysis

## 1. Overview
Supports business idea conceptualization and analysis workflows.

## 2. Business Purpose
Accelerate early business design for users creating new ventures.

## 3. Module Responsibilities
- Trigger AI-backed analysis pipelines
- Persist conceptualization outputs
- Provide market/business orientation assets

## 4. System Dependencies
### Internal dependencies
- conceptualization module
- market analysis module
- today focus module

### External dependencies
- LLM provider(s)

## 5. Database Tables
Conceptualization/analysis result tables.

## 6. Backend Structure
- `ia.routes.js`
- `conceptualization.routes.js`
- `marketAnalysis.routes.js`
- `todayFocus.routes.js`

## 7. API Endpoints
- `/api/ia/*`
- `/api/conceptualization/*`
- `/api/market-analysis/*`
- `/api/today-focus/*`

## 8. Frontend Components
Conceptualization and business orientation pages in dashboard.

## 9. User Flows
User requests analysis -> backend processes -> output shown in module pages.

## 10. Data Flow
Frontend prompt/request -> API -> AI/business logic -> stored response -> frontend rendering.

## 11. Validations
Input shape validation and business constraints around analysis execution.

## 12. Security Considerations
Authenticated access and controlled generation endpoints.

## 13. Edge Cases
Partial AI output, timeout/retry, prompt/data inconsistency.

---

# Module: Landing & Lead Acquisition

## 1. Overview
Public-facing marketing and conversion layer for EmpowerMe acquisition.

## 2. Business Purpose
Acquire users and route prospects into onboarding/application funnel.

## 3. Module Responsibilities
- Present product value proposition
- Capture lead intent
- Redirect users into app registration/build-company flow

## 4. System Dependencies
### Internal dependencies
- app entry routes
- potential public backend endpoints

### External dependencies
- Analytics/marketing tools (if configured)

## 5. Database Tables
Typically indirect; lead persistence may rely on backend endpoints or third-party tooling.

## 6. Backend Structure
May consume public routes in backend as needed.

## 7. API Endpoints
Public endpoints where landing requires submission/interaction.

## 8. Frontend Components
Landing pages, sections, CTA blocks, and conversion forms.

## 9. User Flows
Visitor lands -> reviews value proposition -> clicks CTA -> app onboarding/login.

## 10. Data Flow
Landing interactions -> optional API/analytics event -> app funnel transition.

## 11. Validations
Form validation for contact/lead interactions.

## 12. Security Considerations
Input sanitization for public forms and abuse prevention.

## 13. Edge Cases
Incomplete form submissions, broken redirects, duplicated lead records.

---

# Module: Database & Automation Assets

## 1. Overview
Data persistence and support automation repository for EmpowerMe operations.

## 2. Business Purpose
Guarantee data integrity and provide operational tooling/documented execution traces.

## 3. Module Responsibilities
- Maintain SQL baseline
- Track operational tasks/logs
- Store automation support docs

## 4. System Dependencies
### Internal dependencies
- backend model/schema contracts

### External dependencies
- DB engine/environment where SQL is applied

## 5. Database Tables
Defined in:
- `/var/www/empowerme/dev_androide_17/db/empowerMe database.sql`

## 6. Backend Structure
Backend models and SQL schema must stay aligned.

## 7. API Endpoints
Indirect dependency through all backend data-backed endpoints.

## 8. Frontend Components
Indirect dependency through all persisted data views.

## 9. User Flows
Any persisted user action eventually lands in DB layer.

## 10. Data Flow
Frontend -> backend -> models/services -> SQL DB -> response/state updates.

## 11. Validations
Schema constraints + backend validations + business-rule checks.

## 12. Security Considerations
No secrets in repository, migration discipline, data integrity controls.

## 13. Edge Cases
Schema drift, migration mismatch, non-idempotent update scripts.

---

## Cross-Module Security Considerations

- Authenticated endpoints protected by token checks.
- Role-based access control used for sensitive modules.
- Input validation enforced through schema/validation layers.
- Payment and scheduling webhooks must verify origin/signature.
- Public-facing forms should include abuse/rate-limiting controls.

---

## Final Client Reception Checklist

### Functional Coverage
- [x] Landing capability documented.
- [x] Frontend app modules documented.
- [x] Backend domains documented.
- [x] Database/automation layer documented.

### Technical Delivery
- [x] Module-by-module architecture and dependencies documented.
- [x] API landscapes identified by module.
- [x] Data flow and validation strategy documented.
- [x] Security and edge cases documented.

### Client Readiness
- [x] Useful as an end-to-end acceptance checklist.
- [x] Supports reception review for full platform delivery.
- [x] Includes English + Spanish markdown versions.
