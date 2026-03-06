# Implementation Plan for an AI Company-Creation Agent

## Scope
Implement an orchestration agent that can execute the existing company creation flow without changing current behavior.

## Phase 1 - Discovery and Contract Freezing
1. Freeze API contracts used by flow:
   - catalog GET endpoints
   - auth endpoints
   - `POST /api/build-company`
2. Define canonical response models in the agent layer.
3. Add endpoint health checks before conversation starts.

## Phase 2 - Conversation Engine
1. Implement state machine with explicit stages:
   - `collecting_data`
   - `auth_required`
   - `awaiting_verification`
   - `ready_to_submit`
   - `submitted`
2. Implement per-field validators mirroring Joi rules in `buildCompanySchema`.
3. Implement catalog resolvers (name -> ID mapping).

## Phase 3 - API Orchestration
1. Build a client to execute calls in required order.
2. Add retry policy for transient failures.
3. Add observability:
   - request IDs
   - latency
   - validation errors
   - endpoint status

## Phase 4 - Auth/Cognito Handling
1. Support email/password path:
   - signup
   - verify-email checkpoint
   - login
2. Support OAuth-assisted path with explicit user handoff.
3. Persist and rotate token context safely.

## Phase 5 - Safety and Idempotency
1. Add duplicate submission guard in agent session.
2. Recommended backend enhancement: idempotency key for `POST /build-company`.
3. Add dry-run mode for payload preview before submission.

## Phase 6 - Testing Strategy

### Unit tests
- Field validation rules
- Catalog mapping logic
- State transitions

### Integration tests
- Happy path (new user)
- Existing user login path
- Verify-email required path
- OAuth branch callback path
- Invalid payload recovery

### End-to-end tests
- Simulated chat transcript -> API execution -> successful company setup ID.

## Backend/API Changes Potentially Needed (optional, not mandatory for initial rollout)
- Idempotency support for `POST /build-company`.
- Optional endpoint to expose wizard metadata schema for dynamic chat prompts.
- Optional endpoint to pre-validate payload without writing DB.

## Rollout Plan
1. Internal sandbox testing.
2. Limited beta with operator monitoring.
3. Progressive rollout by percentage of users.
4. Full release after success/error thresholds are stable.

## Success Metrics
- Completion rate of company creation flow.
- Validation error rate before final submit.
- Mean turns to completion in chat.
- Time-to-completion compared to UI wizard.
- Failure rate by endpoint/auth stage.