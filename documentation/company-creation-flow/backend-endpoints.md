# Backend Endpoints Used by Company Creation Flow

Base prefix assumed in app: `/api`

## 1) Catalog endpoints (wizard data sources)

### GET `/api/today-focus`
- Description: returns options for wizard step 2.
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example request:
```http
GET /api/today-focus HTTP/1.1
Host: <api-host>
```
- Example response:
```json
[
  { "id": 1, "name": "Formalizar empresa", "image": "/images/..." }
]
```

### GET `/api/company-offering`
- Description: returns options for wizard step 3 (what the company offers).
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example response:
```json
[
  { "id": 3, "name": "Servicios", "image": "/images/..." }
]
```

### GET `/api/customer-service-channel`
- Description: returns customer service channel options for wizard step 3.
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example response:
```json
[
  { "id": 2, "name": "Online", "description": "Canales digitales", "image": "/images/..." }
]
```

### GET `/api/business-sectors`
- Description: returns business sector catalog for wizard step 4.
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example response:
```json
[
  { "id": 7, "name": "Tecnología" },
  { "id": 11, "name": "Otros" }
]
```

### GET `/api/region`
- Description: returns region catalog for wizard step 5.
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example response:
```json
[
  { "id": 1, "name": "Región Metropolitana" }
]
```

### GET `/api/marketing-source`
- Description: returns marketing attribution options for wizard step 9.
- Auth: public
- Expected body: none
- Validation: none (GET)
- Example response:
```json
[
  { "id": 4, "name": "Google", "image": "/images/marketing_source/google.svg" }
]
```

---

## 2) Authentication and identity endpoints

### POST `/api/auth/signup`
- Description: register user in Cognito + create local user + user identity and default features.
- Auth: public
- Expected body:
```json
{
  "email": "user@example.com",
  "password": "AStrong@Pass1",
  "countryCode": "CL"
}
```
- Validation (Joi):
  - `email`: required, valid email
  - `password`: 8-50, must include lowercase, uppercase, number, special char
  - `countryCode`: 2-char uppercase string
- Example response:
```json
{ "message": "User registered" }
```

### POST `/api/auth/login`
- Description: authenticate against Cognito and return app tokens + redirect metadata.
- Auth: public
- Expected body:
```json
{
  "email": "user@example.com",
  "password": "AStrong@Pass1"
}
```
- Validation (Joi):
  - `email`: required, email
  - `password`: 8-50, at least uppercase + number
- Example response (shape):
```json
{
  "accessToken": "...",
  "idToken": "...",
  "refreshToken": "...",
  "userId": 123,
  "userType": 3,
  "postLoginRedirect": "/dashboard"
}
```

### POST `/api/auth/google`
- Description: app-level login/registration bridge after Google OAuth token exchange.
- Auth: public
- Expected body:
```json
{
  "idToken": "<google-or-cognito-id-token>",
  "countryCode": "CL"
}
```
- Validation (Joi):
  - `idToken`: required
  - `countryCode`: optional, 2-char uppercase
- Example response:
```json
{
  "message": "Login success",
  "userId": 123,
  "userType": 3,
  "postLoginRedirect": "/dashboard/buildCompany",
  "companyId": 456
}
```

### POST `/api/auth/verify-email`
- Description: confirm Cognito signup code.
- Auth: public
- Expected body:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
- Validation (Joi):
  - `email`: required, email
  - `code`: exactly 6 numeric chars
- Example response:
```json
{ "message": "Email verified" }
```

---

## 3) Final company creation endpoint

### POST `/api/build-company`
- Description: persists full company setup from wizard answers.
- Auth: protected (`Authorization: Bearer <accessToken>`)
- Expected body:
```json
{
  "company_name": "Acme SpA",
  "today_focus": [1],
  "company_offering": [2, 3],
  "customer_service_channel": [1],
  "has_employees": "NO",
  "is_registered_company": "NO",
  "hasStartedActivities": "NO",
  "marketing_source": [4],
  "about": "Digital accounting services for SMBs",
  "business_sector_id": 7,
  "business_sector_other": "",
  "street": "Av. Providencia 123",
  "zip_code": "7500000",
  "region_id": 1,
  "phone_number": {
    "countryCode": "CL",
    "phone_code": "+56",
    "phone": "912345678"
  }
}
```
- Validation (Joi `buildCompanySchema`):
  - required arrays with `min(1)` for: `today_focus`, `company_offering`, `customer_service_channel`, `marketing_source`
  - enum validation:
    - `has_employees`: `SI|NO|NOT_SURE`
    - `is_registered_company`: `SI|NO`
    - `hasStartedActivities`: `SI|NO`
  - string lengths and required fields for `about`, `street`, `zip_code`
  - numeric positive validation for `business_sector_id`, `region_id`
  - nested `phone_number` validation:
    - `countryCode`: 2 uppercase letters
    - `phone_code`: regex `^\+\d{1,3}$`
    - `phone`: regex `^\d{7,11}$`
- Example response:
```json
{
  "company_setup_id": 987
}
```

## Business Rules Implemented in Controller
- Finds user by Cognito `sub` (`req.user.sub`).
- Grants feature IDs 3,4,5,6,7 if missing.
- If user already has a company, reuses company ID.
- If no company exists, creates one.
- If `business_sector_other` is provided, forces sector to `11` (OTHERS).
- Creates address, company setup, and inserts responses into relational tables:
  - `today_focus_responses`
  - `company_offering_responses`
  - `customer_service_channel_responses`
  - `marketing_source_responses`