# CI Instructions — VercelAutoLenis (No-Secrets, Deterministic Builds)

## Scope
Applies to:
- `.github/workflows/**`
- `package.json` scripts
- Any build/test/lint scripts
- Vercel build behavior assumptions

## Primary Objectives
- CI is the source of truth: `pnpm install`, `pnpm lint`, `pnpm test`, and `pnpm build` should succeed.
- CI must succeed with a minimal environment (no private secrets).
- Builds must be deterministic and not perform DB/network operations at build time unless explicitly optional and gated.

## No-Secrets Policy (Absolute)
- Never commit `.env` files.
- Never add real credentials to CI configs.
- Use placeholders only where required and safe, and document them in `.env.example` or docs.

## Deterministic Build Rules
- No database calls during `pnpm build`.
- No network calls during `pnpm build` unless:
  - explicitly optional,
  - gated by env checks,
  - and failures degrade gracefully (do not fail build).

## Required CI Pipeline Behavior
- Install: `pnpm install` must succeed without secrets.
- Lint: `pnpm lint` should run; if skipped, include explicit justification in workflow comments.
- Test: `pnpm test` (or `pnpm vitest`) should run; if skipped, justify.
- Build: `pnpm build` must succeed without private env vars.

## Env-Gating Guidelines
- Any step requiring secrets must be guarded, e.g.:
  - `if [ -n "$SOME_SECRET" ]; then ...; else echo "Skipping ..."; fi`
- Prisma: do not run unguarded `prisma generate` or DB-touching commands in CI if `POSTGRES_PRISMA_URL` is missing.
- If validate/generate must run, use safe gating or placeholders and never real creds.

## Vercel Compatibility
- Assume Vercel runs install + build in a clean environment.
- Avoid custom hacks that depend on local files.
- If Vercel requires env vars, those must be configured in Vercel project settings, not committed.

## PR Requirements for CI Changes
- Every CI-related PR must include:
  - Root cause of failure
  - What changed
  - How to verify (CI checks + local commands)
  - Any follow-ups

## Definition of Done (CI)
- GitHub Actions workflow passes on main branch.
- `pnpm install` succeeds without private env vars.
- `pnpm build` succeeds without private env vars.
- No secrets introduced; `.env` remains untracked.
