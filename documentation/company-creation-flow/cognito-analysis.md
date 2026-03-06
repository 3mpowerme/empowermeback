# Cognito Integration Analysis for Company Creation

## Current Integration Points
Backend files:
- `src/controllers/auth/auth.controller.js`
- `src/services/cognito.service.js`
- `src/utils/cognito.js`

Frontend files:
- `src/features/Auth/SignUpPage.jsx`
- `src/features/Auth/LoginPage.jsx`
- `src/features/Auth/CallbackPage.jsx`
- `src/utils/auth.js`

## How User Creation Works Today

### Email/password signup path
1. Frontend calls `POST /api/auth/signup` with email/password/countryCode.
2. Backend calls Cognito `signUp` (AWS SDK `CognitoIdentityServiceProvider`).
3. Backend also creates local user (`users` table), links identity (`user_identities`), assigns default features.
4. User must verify code (email) through `POST /api/auth/verify-email`.
5. User logs in via `POST /api/auth/login` to obtain JWT tokens.
6. Frontend calls `POST /api/build-company` with access token.

### Google path
1. Frontend uses Cognito hosted UI and Google identity provider.
2. Frontend exchanges authorization code at Cognito `/oauth2/token`.
3. Frontend sends `idToken` to backend `POST /api/auth/google`.
4. Backend verifies token (`jwt.verify` + JWK), upserts user identity and returns app-level metadata.
5. Frontend calls `POST /api/build-company` with Bearer access token.

## Endpoints Involved in Cognito-Related Flow
- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/refresh-token` (session continuity)
- `POST /api/auth/logout`

## Can Another Agent Create Users Automatically?
Short answer: **partially yes, with constraints**.

### Fully automatable parts
- Collect signup payload and call `/auth/signup`.
- Call `/auth/login` once account is confirmed.
- Call `/build-company` after valid token exists.
- Orchestrate Google backend call `/auth/google` if idToken is available.

### Non-trivial/partially automatable parts
- Email confirmation code retrieval for `/auth/verify-email` (depends on user mailbox access).
- Google OAuth interactive consent in hosted UI.
- Potential Cognito challenge flows (MFA/new password) if enabled in future.

## Cognito Limitations and Practical Implications
1. **Email confirmation dependency**
   - If user is not confirmed, login fails and automation must request code.
2. **Token lifecycle handling**
   - Agent must maintain access/refresh tokens securely.
3. **External OAuth interactions**
   - Google OAuth requires browser/consent step unless pre-authorized flow exists.
4. **Error handling needed**
   - Typical Cognito errors: user not confirmed, invalid password policy, invalid code.

## Additional Steps Required for Robust Automation
- Implement conversation fallback when confirmation code is required.
- Add explicit state machine for auth status: `SIGNED_UP -> CONFIRMED -> AUTHENTICATED -> COMPANY_CREATED`.
- Add retry/idempotency strategy for `/build-company` to avoid duplicate inserts.
- Optionally introduce backend endpoint to atomically complete `signup + verify + login + build-company` when possible (future enhancement).