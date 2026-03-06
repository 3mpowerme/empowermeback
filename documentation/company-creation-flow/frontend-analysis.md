# Frontend Analysis: `/buildCompany` Wizard

## Route and State Management
- Route: `/buildCompany?name=<Company_Name>`
- Container page: `BuildCompanyWizardPage.jsx`
- State store: `BuildCompanyProvider` using localStorage (`buildCompany`).
- Continue gating: `Wizard.jsx` checks `state.stepN.canContinue` before moving to next step.

## Step-by-Step Breakdown

### Step 1 - Intro
- Component: `BuildCompanyWizardStep1`
- Input collected: none (informational)
- Validation: always pass (`canContinue: true`)
- API calls: none

### Step 2 - Today Focus
- Component: `BuildCompanyWizardStep2`
- Inputs:
  - `todayFocus` (array of selected IDs)
- Validation:
  - at least one option selected
- API calls:
  - `GET /api/today-focus`

### Step 3 - Offering + Customer Service Channel
- Component: `BuildCompanyWizardStep3`
- Inputs:
  - `companyOffering` (array IDs)
  - `customerServiceChannel` (array IDs)
- Validation:
  - at least one selection in each group
- API calls:
  - `GET /api/company-offering`
  - `GET /api/customer-service-channel`

### Step 4 - Business Sector + About
- Component: `BuildCompanyWizardStep4`
- Inputs:
  - `business_sectors` (selected sector ID or new custom text)
  - `business_sector_other` (when custom option is typed)
  - `about` (textarea, maxLength 500 in UI)
- Validation:
  - sector required
  - about required
- API calls:
  - `GET /api/business-sectors`

### Step 5 - Operating Location and Phone
- Component: `BuildCompanyWizardStep5`
- Inputs:
  - `region_id`
  - `street`
  - `zip_code`
  - `phone_number` object: `{ countryCode, phone_code, phone }`
- Validation:
  - all fields required
  - phone required through `phone_number.phone`
- API calls:
  - `GET /api/region`

### Step 6 - Employees
- Component: `BuildCompanyWizardStep6`
- Inputs:
  - `hasEmployees` (`SI|NO|NOT_SURE`)
- Validation:
  - practical validation by required card interaction
- API calls: none

### Step 7 - Registered Company
- Component: `BuildCompanyWizardStep7`
- Inputs:
  - `isRegisteredCompany` (`SI|NO`)
- Validation:
  - practical validation by required card interaction
- API calls: none

### Step 8 - Started Activities in SII
- Component: `BuildCompanyWizardStep8`
- Inputs:
  - `hasStartedActivities` (`SI|NO`)
- Validation:
  - practical validation by required card interaction
- API calls: none

### Step 9 - Marketing Source
- Component: `BuildCompanyWizardStep9`
- Inputs:
  - `marketingSource` (array IDs)
- Validation:
  - selection required
- API calls:
  - `GET /api/marketing-source`

## Final Submit Trigger
The wizard itself does not call `POST /build-company`. It redirects to auth (`/signup`) after step 9. The final company creation request happens in auth pages after successful authentication.

## Auth Bridge Logic (Critical)
Files:
- `src/features/Auth/SignUpPage.jsx`
- `src/features/Auth/LoginPage.jsx`
- `src/features/Auth/CallbackPage.jsx`

Behavior:
- If all wizard steps are complete in localStorage (`shouldBuildCompany`), frontend builds a payload and calls:
  - `POST /api/build-company`
- Trigger happens after:
  - successful login (`/auth/login`)
  - successful Google callback (`/auth/google` + Cognito token exchange)
  - or signup flow once authenticated and returning through auth pages.

## Frontend Validation Summary
- Required selections and text fields are enforced for wizard progression.
- Backend receives arrays and scalar values normalized from localStorage.
- Additional strict validation is enforced server-side by Joi (`buildCompanySchema`).