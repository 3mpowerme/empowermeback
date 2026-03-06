# Chat Agent Conversational Flow Proposal

## Design Goal
Collect all required data for `/build-company` through conversation, validate each answer, and trigger API calls in the correct order.

## Conversation State Fields
- company_name
- today_focus[]
- company_offering[]
- customer_service_channel[]
- business_sector_id or business_sector_other
- about
- region_id
- street
- zip_code
- phone_number: `{ countryCode, phone_code, phone }`
- has_employees (`SI|NO|NOT_SURE`)
- is_registered_company (`SI|NO`)
- hasStartedActivities (`SI|NO`)
- marketing_source[]
- auth status + token context

## API-Assisted Question Flow

### 0) Warm-up / company name
- Agent question: "What is your company name?"
- Save: `company_name`
- Validation: non-empty, <=150 chars.

### 1) Today focus
- API call: `GET /api/today-focus`
- Agent question: "What do you want to focus on today?"
- Validation: at least 1 valid ID from catalog.

### 2) Company offering
- API call: `GET /api/company-offering`
- Agent question: "What does your company offer?"
- Validation: at least 1 valid ID.

### 3) Customer service channel
- API call: `GET /api/customer-service-channel`
- Agent question: "Where will you serve your customers?"
- Validation: at least 1 valid ID.

### 4) Business sector and business description
- API call: `GET /api/business-sectors`
- Agent question A: "Which business sector best fits your company?"
- Agent question B: "Tell me more about your business in up to 500 characters."
- Validation:
  - sector required
  - about required, 1..500 chars
  - if sector is custom text, map to `business_sector_other` and keep fallback id logic.

### 5) Operating location and phone
- API call: `GET /api/region`
- Agent questions:
  - "Which region will you operate from?"
  - "What is your street and number?"
  - "What is your ZIP/postal code?"
  - "What is your phone number (country code + prefix + number)?"
- Validation:
  - region_id positive integer
  - street required
  - zip_code length 5..7
  - phone format:
    - countryCode: 2 uppercase letters
    - phone_code: `+` and 1..3 digits
    - phone: 7..11 digits

### 6) Employee status
- Agent question: "Are you planning to hire employees or do you already have employees?"
- Accepted: `SI|NO|NOT_SURE`

### 7) Registered company status
- Agent question: "Is your company already legally registered?"
- Accepted: `SI|NO`

### 8) Started activities in SII
- Agent question: "Have you started activities in SII?"
- Accepted: `SI|NO`

### 9) Marketing source
- API call: `GET /api/marketing-source`
- Agent question: "How did you hear about EmpowerMe?"
- Validation: at least 1 valid ID.

### 10) Authentication and submission
- If user has no token:
  - ask for preferred auth path: email/password or Google
  - orchestrate signup/login flow
  - handle verify-email checkpoint if required
- Final API call:
  - `POST /api/build-company` with collected payload and Bearer token

## Example Snippet (required format)
- Agent question: "What is the name of your company?"
- User response: `Acme SpA`
- API call: *(none yet, value stored)*

- Agent question: "How did you hear about EmpowerMe?"
- User response: `Google`
- API call before question: `GET /api/marketing-source`
- Mapping: `Google -> id=4`

- Final API call:
```http
POST /api/build-company
Authorization: Bearer <token>
Content-Type: application/json
```

## Validation Strategy
- Validate each field immediately after answer.
- Re-prompt only invalid fields.
- Before final submit, run full schema-equivalent validation to avoid backend 400s.

## Error and Recovery Strategy
- 401: refresh token/login checkpoint.
- 400: parse Joi message, re-ask specific field.
- 500: retry with exponential backoff and human escalation path.