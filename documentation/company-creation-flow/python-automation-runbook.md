# Python Automation Runbook - Company Creation (Automation 1)

## Purpose
This runbook documents how to run the Python automation that executes EmpowerMe's company creation flow using:
- email/password signup
- email verification
- login
- final `POST /api/build-company`

The implementation is intentionally hosted in `dev_androide_17/automations/company_creation`.

## Trigger
The automation starts **only** when the exact message is received:

`Automatizacion 1 Creacion de empresa`

## First mandatory question
After trigger, the first prompt is always:

`¿Cuál es el dominio base del backend? Ejemplo: https://api.tudominio.com`

No API calls are attempted before receiving a valid backend domain.

## Files involved
Located in `dev_androide_17`:

- `automations/company_creation/constants.py`
- `automations/company_creation/validators.py`
- `automations/company_creation/api_client.py`
- `automations/company_creation/state_store.py`
- `automations/company_creation/flow.py`
- `automations/company_creation/trigger.py`
- `automations/company_creation/cli.py`
- `automations/README.md`
- `automations/requirements.txt`

## Configuration
Install dependencies:
```bash
pip install -r automations/requirements.txt
```

## Execution
From `dev_androide_17` root:
```bash
python3 -m automations.company_creation.cli
```

## Sequence implemented
1. Collect backend domain.
2. Collect all required wizard fields.
3. `POST /api/auth/signup` (email/password).
4. `POST /api/auth/verify-email` (verification code from user).
5. `POST /api/auth/login`.
6. `POST /api/build-company` with Bearer token.

## Error handling
The automation handles:
- invalid backend domain format
- invalid email/password/phone/zip formats
- network failures
- 4xx/5xx API responses
- missing access token in login response

## Known limitations
- No Google/Social login support by design.
- Verification code must be entered by user (email challenge).
- Single-flow local state file (`.state.json`) is used.
- Catalogs are fetched after backend domain is provided, but ID options are still user-driven input.

## Notes about source-of-truth
The implementation was designed using docs under:
`documentation/company-creation-flow/`

Any inconsistency between docs and runtime API behavior should be treated as integration feedback and logged for follow-up.
