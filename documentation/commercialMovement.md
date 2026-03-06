# commercialMovement API

- Source route file: `src/routes/commercialMovement.routes.js`
- Mounted prefixes: `/api/commercial-movements`

## GET /api/commercial-movements/

### Description
- Handler: `CommercialMovementController.getAll`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Public

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
GET /api/commercial-movements/ HTTP/1.1
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

## GET /api/commercial-movements/:id

### Description
- Handler: `CommercialMovementController.getById`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Public

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
GET /api/commercial-movements/:id HTTP/1.1
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

## POST /api/commercial-movements/

### Description
- Handler: `CommercialMovementController.create`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Public

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
- Joi middleware detected: `validate(commercialMovementSchema)`
- `name`: `Joi.string().min(2).max(150).required()`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/commercial-movements/ HTTP/1.1
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

## PUT /api/commercial-movements/:id

### Description
- Handler: `CommercialMovementController.update`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Public

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
- Joi middleware detected: `validate(commercialMovementSchema)`
- `name`: `Joi.string().min(2).max(150).required()`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
PUT /api/commercial-movements/:id HTTP/1.1
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

## DELETE /api/commercial-movements/:id

### Description
- Handler: `CommercialMovementController.remove`
- Observed behavior: route delegates logic to controller/service/model layers.

### Authentication
- Public

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
DELETE /api/commercial-movements/:id HTTP/1.1
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
