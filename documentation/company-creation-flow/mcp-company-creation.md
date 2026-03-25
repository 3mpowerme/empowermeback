# MCP Server: Company Creation + Auth

## Objective
Provide a formal MCP server inside the backend repository that exposes the EmpowerMe company creation flow plus the required Cognito email/password authentication steps needed to complete it from chat.

## Server location
- Entry point: `src/mcp/companyCreationServer.js`
- Company creation orchestration service: `src/services/companyCreationMcp.service.js`
- Auth orchestration service: `src/services/authMcp.service.js`
- Start command: `npm run mcp:company-creation`

## Protocol and transport
- Protocol: Model Context Protocol (MCP)
- SDK: `@modelcontextprotocol/sdk`
- Transport: stdio

## Tools

### 1. `auth_signup_email_password`
Registers a Cognito user and ensures the matching local EmpowerMe user/identity records exist.

Inputs:
- `email`
- `password`
- `countryCode`

Response includes:
- validation result
- local `userId`
- Cognito `sub`
- next step hint

### 2. `auth_verify_email_code`
Confirms the six-digit email verification code.

Inputs:
- `email`
- `code`

Response includes:
- validation result
- verification status
- next step hint

### 3. `auth_login_email_password`
Authenticates against Cognito and returns the tokens required for company creation execution.

Inputs:
- `email`
- `password`

Response includes:
- `accessToken`
- `idToken`
- `refreshToken`
- local user context
- optional existing company info

### 4. `company_creation_describe_flow`
Returns the flow definition used by the MCP server.

### 5. `company_creation_get_catalogs`
Loads the catalogs required by the company creation flow.

Supported catalog names:
- `today_focus`
- `company_offering`
- `customer_service_channel`
- `business_sector`
- `region`
- `marketing_source`
- `country`

### 6. `company_creation_resolve_catalog_options`
Resolves business-friendly names or raw ids into canonical backend ids.

Inputs:
- `catalog`
- `values[]`
- `allowFreeText` optional

### 7. `company_creation_save_step`
Validates one business step and merges it into a draft.

Inputs:
- `draft` optional
- `step`
- `input`

### 8. `company_creation_finalize`
Builds and validates the final payload, then either dry-runs or executes the backend flow.

Inputs:
- `draft` optional
- `payload` optional
- `mode`: `dry_run | execute`
- `accessToken` required only for `execute`

Behavior:
- `dry_run`: validates against `buildCompanySchema` without writing to the database
- `execute`: validates the Cognito access token and invokes `BuildCompanyController.fillInfo`

## Chat flow mapping

| Chat step | MCP tool |
|---|---|
| collect email/password | `auth_signup_email_password` |
| collect email verification code | `auth_verify_email_code` |
| obtain token after verification | `auth_login_email_password` |
| final company submit | `company_creation_finalize` |

## Validation rules reused
The MCP reuses backend contracts instead of redefining separate schemas:
- signup/login/verify validation reuses `auth.schema.js`
- final payload validation reuses `buildCompanySchema`
- execution path reuses `BuildCompanyController.fillInfo`
- token validation reuses `validateAccessToken`
- catalog values come from the existing backend models

## Notes
- This version now supports the full auth gate needed by the chat automation.
- Real end-to-end execution still depends on valid Cognito and database configuration.
- The chat automation in `empowerme/automations` should treat company data as a prebuilt draft and use this MCP for signup, verification, login, and final submit.
