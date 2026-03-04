# virtualOfficeIntake API

- Source route file: `src/routes/virtualOfficeIntake.routes.js`
- Mounted prefixes: `/api/virtual-office-request`

## POST /api/virtual-office-request/:companyId/:serviceCode

### Description
- Handler: `VirtualOfficeIntakeController.create`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `companyId`: string.
- `serviceCode`: string.

### Query Params
- Not explicitly declared at route layer (verify controller/model).

### Request Body
- Controller-defined payload (see controller + schema if present).

### Validations
- Joi middleware detected: `validate(createVirtualOfficeContractIntakeSchema)`
- `company_name`: `Joi.string().max(255).required()`
- `company_tax_id`: `Joi.string().max(20).required()`
- `company_address`: `Joi.string().max(255).required()`
- `company_commune`: `Joi.string().max(255).required()`
- `company_region`: `Joi.string().max(255).required()`
- `contact_person_name`: `Joi.string().max(255).allow(null`
- `contact_person_email`: `Joi.string().email().max(255).allow(null`
- `contact_person_phone`: `phoneSchema.allow(null)`
- `legal_representative_name`: `Joi.string().max(255).required()`
- `legal_representative_tax_id`: `Joi.string().max(20).required()`
- `legal_representative_address`: `Joi.string().max(255).required()`
- `legal_representative_commune`: `Joi.string().max(255).required()`
- `legal_representative_region`: `Joi.string().max(255).required()`
- `legal_representative_profession`: `Joi.string().max(255).required()`
- `legal_representative_nationality`: `Joi.string().max(100).required()`
- `legal_representative_civil_status`: `Joi.string()`
- `legal_representative_email`: `Joi.string().email().max(255).required()`
- `legal_representative_phone`: `phoneSchema.allow(null)`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/virtual-office-request/:companyId/:serviceCode HTTP/1.1
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
