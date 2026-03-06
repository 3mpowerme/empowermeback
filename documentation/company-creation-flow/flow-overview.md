# Company Creation Flow Overview (`/buildCompany`)

## Objective
Document the current EmpowerMe company creation wizard and evaluate whether a chat-based AI agent can execute the same flow by calling backend APIs in the correct order.

## Entry Points
- Frontend route: `/buildCompany?name=<Company_Name>`
- Main page component: `src/features/BuildCompany/BuildCompanyWizardPage.jsx`
- Wizard shell component: `src/components/Wizard/Wizard.jsx`
- Step state persistence: `src/context/BuildCompany/BuildCompanyProvider.jsx` (local storage key: `buildCompany`)

## High-Level Behavior
1. User enters company name and starts wizard.
2. Frontend collects data across 9 steps.
3. Frontend fetches catalog data for selectable options (today focus, offerings, channels, sectors, regions, marketing source).
4. After step 9, user is redirected to auth (`/signup`, `/login`, or Google OAuth callback flow).
5. After authentication succeeds, frontend sends one consolidated request:
   - `POST /api/build-company`
6. Backend creates or reuses company, inserts company setup/address, links feature access, and stores questionnaire responses.

## Components In Scope
- Frontend wizard steps: `BuildCompanyWizardStep1..9`
- Frontend auth bridge: `SignUpPage`, `LoginPage`, `CallbackPage`
- Backend endpoint for final creation: `POST /api/build-company`
- Backend catalogs used by wizard steps:
  - `GET /api/today-focus`
  - `GET /api/company-offering`
  - `GET /api/customer-service-channel`
  - `GET /api/business-sectors`
  - `GET /api/region`
  - `GET /api/marketing-source`
- Backend auth/cognito endpoints used by flow:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/google`
  - (email verification path) `POST /api/auth/verify-email`

## Main Finding
The flow is already mostly API-driven and deterministic. Automation by a second AI agent is viable if the agent can:
- Collect all required fields with strong validation.
- Authenticate user (or orchestrate OAuth/verification path).
- Preserve execution order and token context.
- Handle Cognito confirmation and edge cases.