# Automation Feasibility Assessment

## Executive Summary
Automating the company creation flow with a chat-based AI agent is **highly feasible** for data collection and API orchestration, and **moderately feasible end-to-end** due to authentication constraints (email confirmation and OAuth interactivity).

## Feasibility by Flow Segment

### 1) Wizard data collection (Steps 1-9)
- Feasibility: **High**
- Reason: deterministic required fields and clear enums/options.
- Notes: catalog endpoints provide canonical IDs to avoid ambiguity.

### 2) Backend API orchestration (`POST /build-company`)
- Feasibility: **High**
- Reason: single consolidated payload endpoint with strict Joi schema.
- Risk: duplicate submissions if retries are uncontrolled.

### 3) Authentication + Cognito
- Feasibility: **Medium**
- Reason: depends on user actions (email verification code, OAuth consent).
- Risk: flow can block waiting for user confirmation inputs.

## What Can Be Automated Easily
- Fetching all catalogs.
- Mapping human answers to canonical IDs.
- Validating required fields and format before submit.
- Building and sending final `POST /api/build-company` payload.
- Recovery guidance for validation errors.

## What Likely Requires Human Interaction
- Entering email verification code from inbox.
- Completing Google OAuth consent/redirect if Google path is chosen.
- Resolving identity-related edge cases (wrong email account, locked account, etc.).

## Technical Risks
1. **Idempotency risk**: repeated company creation calls can duplicate records depending on timing/state.
2. **Auth state drift**: local token/session mismatch between chat agent and API.
3. **Catalog drift**: if catalog IDs change, stale cached mappings can break requests.
4. **Validation mismatch**: chat free-text can violate enum/regex constraints.

## Main Blockers
- No fully non-interactive Cognito confirmation path in current UX.
- OAuth flows are browser-driven and not pure API-only from chat context.

## Recommended Mitigations
- Add orchestration state machine with checkpoints.
- Introduce request idempotency key for `/build-company` (backend enhancement).
- Add pre-submit validator mirroring `buildCompanySchema` in agent layer.
- Keep an explicit human-in-the-loop step for confirmation code/OAuth completion.

## Final Viability Conclusion
- **Can a second AI agent execute most of the flow?** Yes.
- **Can it execute 100% autonomously for all users?** Not always, due to Cognito/OAuth interaction requirements.
- **Practical target:** hybrid automation (agent-led orchestration + user-confirmation checkpoints).