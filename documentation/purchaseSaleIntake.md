# purchaseSaleIntake API

- Source route file: `src/routes/purchaseSaleIntake.routes.js`
- Mounted prefixes: `/api/purchase-sale-request`

## POST /api/purchase-sale-request/:companyId

### Description
- Handler: `PurchaseSaleIntakeController.create`
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
- Joi middleware detected: `validate(createPurchaseSaleIntakeSchema)`
- `company_name`: `Joi.string().max(255).allow(null`
- `company_tax_id`: `Joi.string().max(20).allow(null`
- `shareholders`: `Joi.array().items(shareholderSchema).allow(null)`
- `sold_percentage_or_shares`: `Joi.string().max(255).required()`
- `purchase_sale_price`: `Joi.string().max(255).required()`
- `buyer_full_name`: `Joi.string().max(255).required()`
- `buyer_tax_id`: `Joi.string().max(20).required()`
- `buyer_address_region_commune`: `Joi.string().max(255).required()`
- `buyer_nationality`: `Joi.string().max(100).required()`
- `buyer_marital_status`: `Joi.string().max(100).required()`
- `buyer_occupation`: `Joi.string().max(150).required()`
- `buyer_email`: `Joi.string().email().max(255).required()`
- `seller_full_name`: `Joi.string().max(255).required()`
- `seller_tax_id`: `Joi.string().max(20).required()`
- `seller_address_region_commune`: `Joi.string().max(255).required()`
- `seller_nationality`: `Joi.string().max(100).required()`
- `seller_marital_status`: `Joi.string().max(100).required()`
- `seller_occupation`: `Joi.string().max(150).required()`
- `seller_email`: `Joi.string().email().max(255).required()`
- `contact_person_name`: `Joi.string().max(255).allow(null`
- `contact_person_phone`: `phoneSchema.allow(null)`
- `contact_person_email`: `Joi.string().email().max(255).allow(null`
- `seller_rut_unique_key`: `Joi.string().max(255).required()`

### Business Rules (Observed behavior)
- JWT decoding and user context are handled by `authMiddleware` for protected routes.
- Business constraints are enforced in controllers/models/services, not in route declarations.

### Example Request
```http
POST /api/purchase-sale-request/:companyId HTTP/1.1
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
