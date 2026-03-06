# monthlyAccounting API

- Source route file: `src/routes/monthlyAccounting.routes.js`
- Mounted prefixes: `/api/monthly-accounting`

## GET /api/monthly-accounting/:companyId

### Description
- Handler: `AccountingClientIntakeController.getAll`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `companyId`: string.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- No route-level Joi middleware detected in this route definition.

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
GET /api/monthly-accounting/:companyId HTTP/1.1
Host: <api-host>
```

### Success Response (Example)
```json
{
  "message": "Success (response shape depends on controller)"
}
```

### Error Responses (Example)
```json
{
  "error": "Validation or business error"
}
```

### HTTP Status Codes (Observed)
- `200` / `201` success (controller-dependent).
- `400` validation error (when Joi middleware exists).
- `401` unauthorized for protected endpoints with invalid/missing token.
- `500` internal error.

## POST /api/monthly-accounting/:companyId

### Description
- Handler: `AccountingClientIntakeController.create`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `companyId`: string.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- Joi middleware detected: `validate(createAccountingClientIntakeSchema)`
- `email`: `Joi.string().email().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_sii_password`: `Joi.string().max(255).allow(null`
- `company_contact_email`: `Joi.string().email().max(255).allow(null`
- `company_contact_name`: `Joi.string().max(255).allow(null`
- `company_contact_phone`: `phoneSchema.allow(null)`
- `legal_representative_name`: `Joi.string().max(255).allow(null`
- `legal_representative_tax_id`: `Joi.string().max(20).allow(null`
- `legal_representative_phone`: `phoneSchema.allow(null)`
- `need_activity_start_support`: `Joi.string().max(50).allow(null`
- `commercial_movements`: `Joi.array().items(Joi.number()).single().allow(null)`
- `previred_credentials`: `Joi.string().max(255).allow(null`
- `mutual_credentials`: `Joi.string().max(255).allow(null`
- `medical_leave_credentials`: `Joi.string().max(255).allow(null`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/monthly-accounting/:companyId HTTP/1.1
Host: <api-host>
```

### Success Response (Example)
```json
{
  "message": "Success (response shape depends on controller)"
}
```

### Error Responses (Example)
```json
{
  "error": "Validation or business error"
}
```

### HTTP Status Codes (Observed)
- `200` / `201` success (controller-dependent).
- `400` validation error (when Joi middleware exists).
- `401` unauthorized for protected endpoints with invalid/missing token.
- `500` internal error.

## PUT /api/monthly-accounting/:companyId

### Description
- Handler: `AccountingClientIntakeController.update`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `companyId`: string.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- Joi middleware detected: `validate(updateAccountingClientIntakeSchema)`
- `email`: `Joi.string().email().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_sii_password`: `Joi.string().max(255).allow(null`
- `company_contact_email`: `Joi.string().email().max(255).allow(null`
- `company_contact_name`: `Joi.string().max(255).allow(null`
- `company_contact_phone`: `phoneSchema.allow(null)`
- `legal_representative_name`: `Joi.string().max(255).allow(null`
- `legal_representative_tax_id`: `Joi.string().max(20).allow(null`
- `legal_representative_phone`: `phoneSchema.allow(null)`
- `need_activity_start_support`: `Joi.string().max(50).allow(null`
- `commercial_movements`: `Joi.array()`
- `previred_credentials`: `Joi.string().max(255).allow(null`
- `mutual_credentials`: `Joi.string().max(255).allow(null`
- `medical_leave_credentials`: `Joi.string().max(255).allow(null`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
PUT /api/monthly-accounting/:companyId HTTP/1.1
Host: <api-host>
```

### Success Response (Example)
```json
{
  "message": "Success (response shape depends on controller)"
}
```

### Error Responses (Example)
```json
{
  "error": "Validation or business error"
}
```

### HTTP Status Codes (Observed)
- `200` / `201` success (controller-dependent).
- `400` validation error (when Joi middleware exists).
- `401` unauthorized for protected endpoints with invalid/missing token.
- `500` internal error.
