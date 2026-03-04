# dissolutionCompanyIntake API

- Source route file: `src/routes/dissolutionCompanyIntake.routes.js`
- Mounted prefixes: `/api/dissolution-request`

## POST /api/dissolution-request/:companyId/:serviceCode

### Description
- Handler: `DissolutionCompanyIntakeController.create`
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
- Joi middleware detected: `validate(createDissolutionCompanyIntakeSchema)`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `shareholders`: `Joi.array().items(shareholderSchema).allow(null)`
- `contact_person_name`: `Joi.string().max(255).allow(null`
- `contact_person_phone`: `phoneSchema.allow(null)`
- `contact_person_email`: `Joi.string().email().max(255).allow(null`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/dissolution-request/:companyId/:serviceCode HTTP/1.1
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
