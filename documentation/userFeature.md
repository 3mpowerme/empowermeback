# userFeature API

- Source route file: `src/routes/userFeature.routes.js`
- Mounted prefixes: `/api/user-feature`

## GET /api/user-feature/

### Description
- Handler: `UserFeatureController.getAll`
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
- No route-level Joi middleware detected in this route definition.

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
GET /api/user-feature/ HTTP/1.1
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

## GET /api/user-feature/:id

### Description
- Handler: `UserFeatureController.getById`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Required (Bearer token)

### Required Headers
- `Content-Type: application/json` (for JSON payload endpoints).
- `Authorization: Bearer <token>` when authentication is required.

### Path Params
- `id`: string.

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
GET /api/user-feature/:id HTTP/1.1
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
