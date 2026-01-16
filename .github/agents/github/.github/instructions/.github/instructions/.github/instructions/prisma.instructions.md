# Prisma Instructions — VercelAutoLenis (Schema, Generate/Validate, CI Safety)

## Scope
Applies to:
- `prisma/schema.prisma`
- `lib/prisma.ts`
- Any scripts that call Prisma (`postinstall`, migrations runners, setup scripts)

## Primary Objectives
- Keep Prisma schema valid and relations correct.
- Ensure Prisma tooling does NOT hard-fail in CI/build when DB env vars are missing.
- Maintain compatibility with Vercel/Supabase Postgres-style env vars.

## Non-Negotiables
- Never commit secrets (including DB URLs with credentials).
- CI must pass without `POSTGRES_PRISMA_URL` or other private DB env vars.
- Avoid schema-breaking changes unless explicitly required and documented with migration notes.

## Prisma Generate Rules (Critical)
- `prisma generate` must be guarded:
  - If `POSTGRES_PRISMA_URL` (or required Prisma url env) is missing, skip generate gracefully with a clear message.
  - The repository must remain installable and buildable without database connectivity.
- If `prisma generate` is currently in `postinstall`, implement an env guard rather than removing Prisma entirely.

## Prisma Validate/Format
- `prisma format` is always safe.
- `prisma validate` should not require an actual DB connection, but it may require the `url` env var to exist.
  - In CI, do not run validate unless env is present, OR provide a safe placeholder strategy (no real credentials).

## Relation Modeling Rules
- Every relation must have an opposite relation field unless explicitly modeled otherwise.
- Use explicit `@relation(name: "...")` when:
  - Multiple relations exist between the same two models, or
  - Prisma warns about ambiguous relations.
- Ensure relation scalar fields (`...Id`) match optionality and uniqueness constraints properly.

## Migrations Policy
- Prefer not to modify existing migrations.
- If migrations must change:
  - Explain impact clearly in PR notes.
  - Ensure backward compatibility or provide a safe upgrade path.

## Recommended Workflow When Fixing Schema Issues
1. Fix schema with correct opposite fields and explicit relation names.
2. Run `prisma format`.
3. If env is present, run `prisma validate` and `prisma generate`.
4. Update CI scripts to keep steps guarded without secrets.

## Definition of Done (Prisma)
- Schema loads and formats successfully.
- Relations are valid (no missing opposite fields / ambiguity).
- CI can install/build without DB env vars.
- If env is present locally, generate/validate succeeds.
