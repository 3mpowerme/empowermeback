# companyMonthlyAccountingRequest API

- Source route file: `src/routes/companyMonthlyAccountingRequest.routes.js`
- Mounted prefixes: `/api/company-monthly-accounting-request`

## POST /api/company-monthly-accounting-request/:companyId

### Description
- Handler: `CompanyMonthlyAccountingRequestController.create`
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
- Joi middleware detected: `validate(companyMonthlyAccountingRequestSchema)`
- `service_type`: `Joi.string().max(25)`
- `company_id`: `Joi.number().integer().positive()`
- `email`: `Joi.string().email().required()`
- `company_contact_phone`: `Joi.string()`
- `legal_representative_name`: `Joi.string().max(150).required()`
- `legal_representative_rut`: `Joi.string().max(20).required()`
- `legal_representative_phone`: `Joi.string()`
- `need_startup_support`: `Joi.string().valid('SI'`
- `previred_password`: `Joi.string().max(255)`
- `mutual_password`: `Joi.string().max(255)`
- `commercial_movements`: `Joi.array()`
- `rut`: `Joi.string().max(20)`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/company-monthly-accounting-request/:companyId HTTP/1.1
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

## GET /api/company-monthly-accounting-request/:companyId

### Description
- Handler: `CompanyMonthlyAccountingRequestController.getAll`
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
GET /api/company-monthly-accounting-request/:companyId HTTP/1.1
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

## PUT /api/company-monthly-accounting-request/

### Description
- Handler: `CompanyMonthlyAccountingRequestController.update`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- None.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- Joi middleware detected: `validate(companyMonthlyAccountingRequestSchema)`
- `service_type`: `Joi.string().max(25)`
- `company_id`: `Joi.number().integer().positive()`
- `email`: `Joi.string().email().required()`
- `company_contact_phone`: `Joi.string()`
- `legal_representative_name`: `Joi.string().max(150).required()`
- `legal_representative_rut`: `Joi.string().max(20).required()`
- `legal_representative_phone`: `Joi.string()`
- `need_startup_support`: `Joi.string().valid('SI'`
- `previred_password`: `Joi.string().max(255)`
- `mutual_password`: `Joi.string().max(255)`
- `commercial_movements`: `Joi.array()`
- `rut`: `Joi.string().max(20)`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
PUT /api/company-monthly-accounting-request/ HTTP/1.1
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
