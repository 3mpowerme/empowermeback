# ia API

- Source route file: `src/routes/ia.routes.js`
- Mounted prefixes: `/api/ia`

## POST /api/ia/

### Description
- Handler: `IaController.create`
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
- Joi middleware detected: `validate(iaSchema)`
- `description`: `Joi.string().min(1).max(500).required()`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/ia/ HTTP/1.1
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
