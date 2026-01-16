# Purpose
- Keep Next.js App Router route handlers predictable, authenticated, and resilient for Vercel deployment.

## Do
- Place HTTP handlers under `app/api/**/route.ts`; use `NextResponse` with explicit status codes and structured JSON.
- Validate request payloads (zod) and enforce authentication/authorization using the existing auth utilities before touching data.
- Log with context but exclude secrets; normalize errors to safe messages and map expected failures to 4xx responses.
- Reuse shared libs in `lib`/`hooks` for data access and side effects; prefer server-only modules for backend logic.

## Don't
- Bypass auth/validation or perform data writes in client components.
- Throw raw errors to the client or leak stack traces/credentials in responses or logs.
- Commit `.env` files or service keys; only document required envs in `.env.example`.

## Checklist before PR
- [ ] Inputs are validated and authorized; responses use `NextResponse.json` with explicit status codes.
- [ ] Error handling is safe (no secrets) and consistent across handlers.
- [ ] No `.env`/credentials in the diff; any new env is added to `.env.example`.
