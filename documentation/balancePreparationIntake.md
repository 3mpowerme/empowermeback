# balancePreparationIntake API

- Source route file: `src/routes/balancePreparationIntake.routes.js`
- Mounted prefixes: `/api/company-balance-request`

## GET /api/company-balance-request/:companyId

### Description
- Handler: `BalancePreparationIntakeController.getAll`
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
GET /api/company-balance-request/:companyId HTTP/1.1
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

## POST /api/company-balance-request/:companyId

### Description
- Handler: `BalancePreparationIntakeController.create`
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
- Joi middleware detected: `validate(createBalancePreparationIntakeSchema)`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `company_tax_address`: `Joi.string().max(255).allow(null`
- `company_sii_password`: `Joi.string().max(255).allow(null`
- `legal_representative_name`: `Joi.string().max(255).allow(null`
- `legal_representative_tax_id`: `Joi.string().max(20).allow(null`
- `legal_representative_sii_password`: `Joi.string().max(255).allow(null`
- `contact_person_name`: `Joi.string().max(255).allow(null`
- `contact_person_email`: `Joi.string().email().max(255).allow(null`
- `contact_person_phone`: `phoneSchema.allow(null)`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/company-balance-request/:companyId HTTP/1.1
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

## PUT /api/company-balance-request/:companyId/:id

### Description
- Handler: `BalancePreparationIntakeController.update`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `companyId`: string.
- `id`: string.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- Joi middleware detected: `validate(updateBalancePreparationIntakeSchema)`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `company_tax_address`: `Joi.string().max(255).allow(null`
- `company_sii_password`: `Joi.string().max(255).allow(null`
- `legal_representative_name`: `Joi.string().max(255).allow(null`
- `legal_representative_tax_id`: `Joi.string().max(20).allow(null`
- `legal_representative_sii_password`: `Joi.string().max(255).allow(null`
- `contact_person_name`: `Joi.string().max(255).allow(null`
- `contact_person_email`: `Joi.string().email().max(255).allow(null`
- `contact_person_phone`: `phoneSchema.allow(null)`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
PUT /api/company-balance-request/:companyId/:id HTTP/1.1
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
