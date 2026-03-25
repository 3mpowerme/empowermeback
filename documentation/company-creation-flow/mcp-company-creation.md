# MCP Server: Company Creation

## Objective
Provide a formal MCP server inside the backend repository that exposes the existing EmpowerMe company creation flow through business-oriented tools instead of frontend-specific routes and local-storage conventions.

## Server location
- Entry point: `src/mcp/companyCreationServer.js`
- Core orchestration service: `src/services/companyCreationMcp.service.js`
- Start command: `npm run mcp:company-creation`

## Protocol and transport
- Protocol: Model Context Protocol (MCP)
- SDK: `@modelcontextprotocol/sdk`
- Transport: stdio

## Tools

### 1. `company_creation_describe_flow`
Returns the flow definition used by the MCP server.

Response includes:
- ordered business steps
- required fields per step
- linked frontend step numbers
- dependent catalogs

### 2. `company_creation_get_catalogs`
Loads the catalogs required by the flow.

Supported catalog names:
- `today_focus`
- `company_offering`
- `customer_service_channel`
- `business_sector`
- `region`
- `marketing_source`
- `country`

Use cases:
- show available options to an agent or user
- refresh dynamic options before asking a question
- avoid hardcoding ids in prompts

### 3. `company_creation_resolve_catalog_options`
Resolves business-friendly names or raw ids into canonical backend ids.

Inputs:
- `catalog`
- `values[]`
- `allowFreeText` optional

Use cases:
- map `"Google"` to a `marketing_source` id
- map `"Servicios"` to a `company_offering` id
- allow free-text fallback for `business_sector_other`

### 4. `company_creation_save_step`
Validates one business step and merges it into a draft.

Inputs:
- `draft` optional
- `step`
- `input`

Response includes:
- validation result
- updated draft
- payload preview
- completed steps
- remaining steps

### 5. `company_creation_finalize`
Builds and validates the final payload, then either dry-runs or executes the backend flow.

Inputs:
- `draft` optional
- `payload` optional
- `mode`: `dry_run | execute`
- `accessToken` required only for `execute`

Behavior:
- `dry_run`: validates against `buildCompanySchema` without writing to the database
- `execute`: validates the Cognito access token and invokes `BuildCompanyController.fillInfo`

## Tool ↔ flow mapping

| Frontend step | Business step | MCP tool usage |
|---|---|---|
| 1 | company identity intro | `company_creation_save_step` |
| 2 | today focus | `company_creation_get_catalogs` → `company_creation_resolve_catalog_options` → `company_creation_save_step` |
| 3 | offering and channels | `company_creation_get_catalogs` → `company_creation_resolve_catalog_options` → `company_creation_save_step` |
| 4 | business profile | `company_creation_get_catalogs` → `company_creation_resolve_catalog_options` if needed → `company_creation_save_step` |
| 5 | location and phone | `company_creation_get_catalogs` → `company_creation_resolve_catalog_options` for region/country if needed → `company_creation_save_step` |
| 6 | employees | `company_creation_save_step` |
| 7 | registration status | `company_creation_save_step` |
| 8 | tax status | `company_creation_save_step` |
| 9 | marketing source | `company_creation_get_catalogs` → `company_creation_resolve_catalog_options` → `company_creation_save_step` |
| Final submit | build-company | `company_creation_finalize` |

## Controlled validation target
This first version intentionally supports a controlled validation path:
- the full flow can be exercised end-to-end via MCP in `dry_run`
- structural validation mirrors backend Joi rules
- actual database write remains available through `mode=execute`
- live Cognito + DB + real user confirmation is not required for the main validation target of this delivery

## Validation rules reused
The MCP reuses the backend contract instead of redefining a separate schema:
- final payload validation reuses `buildCompanySchema`
- execution path reuses `BuildCompanyController.fillInfo`
- token validation reuses `validateAccessToken`
- catalog values come from the existing backend models

## Example flow

### 1) Load catalogs
```json
{
  "tool": "company_creation_get_catalogs",
  "arguments": {
    "catalogs": ["today_focus", "company_offering", "customer_service_channel"]
  }
}
```

### 2) Resolve friendly values
```json
{
  "tool": "company_creation_resolve_catalog_options",
  "arguments": {
    "catalog": "marketing_source",
    "values": ["Google"]
  }
}
```

### 3) Save step draft
```json
{
  "tool": "company_creation_save_step",
  "arguments": {
    "draft": {},
    "step": "company_identity",
    "input": {
      "company_name": "Acme SpA"
    }
  }
}
```

### 4) Finalize in dry-run mode
```json
{
  "tool": "company_creation_finalize",
  "arguments": {
    "draft": {
      "company_identity": { "company_name": "Acme SpA" }
    },
    "mode": "dry_run"
  }
}
```

## Notes and tradeoffs
- The MCP server is intentionally focused only on company creation.
- Authentication/signup orchestration was not embedded as a separate MCP tool in this first version because the user clarified the validation target is structural/controlled rather than full live E2E.
- The write path still supports real execution when a valid access token is available.
