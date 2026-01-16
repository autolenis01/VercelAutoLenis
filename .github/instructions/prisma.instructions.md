# Purpose
- Maintain a stable Prisma schema and migrations that work locally and in Vercel without leaking secrets.

## Do
- Keep datasource URLs in env vars; document any new keys in `.env.example` and never commit real values.
- Use `prisma format` and align schema changes with migrations under `migrations/`; prefer `prisma migrate dev` for iterative work.
- Guard `prisma generate` so missing `POSTGRES_PRISMA_URL` does not hard-fail (e.g., set a placeholder URL or conditionally skip generate in scripts when the var is absent), including the `postinstall` hook that runs `prisma generate`.
- Run `pnpm build`/`prisma validate` with the expected env loaded before shipping schema changes.

## Don't
- Commit `.env` files, credentials, or generated client output.
- Edit the schema without corresponding migration intent or validation.
- Add scripts that assume `POSTGRES_PRISMA_URL` is always set; keep CI/dev flows tolerant when DB access is unavailable.

## Checklist before PR
- [ ] Schema/migration changes are formatted, validated, and mapped to documented env keys in `.env.example`.
- [ ] `prisma generate` behavior is safe when `POSTGRES_PRISMA_URL` is absent (guarded or skipped with messaging).
- [ ] No `.env`, credentials, or generated artifacts are committed.
