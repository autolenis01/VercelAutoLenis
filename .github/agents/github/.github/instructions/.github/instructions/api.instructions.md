# API Instructions — VercelAutoLenis (Route Handlers, Auth, Error Handling)

## Scope
Applies to:
- `app/api/**`
- Auth-related modules in `lib/auth*`, `lib/middleware/**`, `lib/services/**`
- Any server-side validation and request handling

## Primary Objectives
- Maintain secure, predictable API behavior.
- Preserve stable response contracts unless explicitly changing them with migration notes.
- Ensure handlers are deterministic and do not require secrets at build time.

## Route Handler Standards (Next.js App Router)
- Use explicit HTTP method exports (`export async function GET/POST/...`).
- Always validate inputs (query/body) before use.
- Return consistent JSON shapes; include clear error responses.

## Validation
- Use existing validators under `lib/validators/**` where possible.
- Reject invalid input early with 400-series errors; do not “best-guess” silently.

## Authentication & Authorization
- Enforce auth checks at the start of handlers that require it.
- Never trust client-provided user identifiers; derive from auth/session context.
- Follow existing patterns in `lib/auth-*` and `lib/admin-auth.ts`.
- Do not weaken role checks or broaden permissions.

## Error Handling Requirements
- Do not leak secrets, stack traces, or internal identifiers in responses.
- Use standardized error responses:
  - 400 for validation errors
  - 401 for unauthenticated
  - 403 for unauthorized
  - 404 for missing resources
  - 409 for conflict states (e.g., duplicates)
  - 429 for rate limits (when applicable)
  - 500 for unexpected errors
- Log server errors via existing logger patterns in `lib/logger.ts` / monitoring modules if present.

## Determinism
- Avoid external network calls inside critical request paths unless already designed for it.
- If external calls exist, implement timeouts and safe fallbacks.

## Security Non-Negotiables
- Never commit secrets.
- Never echo back tokens/keys.
- Ensure webhooks verify signatures when secrets are provided; if secrets missing, fail safely with clear logs (not build failures).

## Tests
- If modifying business logic or response shapes:
  - Update/add unit tests (Vitest) for service/validator logic.
  - Update/add e2e tests (Playwright) for user-facing flows where applicable.

## Definition of Done (API)
- Lint + typecheck pass.
- API responses remain consistent and documented if changed.
- Sensitive operations are auth-guarded and do not leak details.
- Tests updated/added where behavior changed.
