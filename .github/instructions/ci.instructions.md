# Purpose
- Keep CI/CD deterministic for the Next.js + pnpm + Prisma stack and protect credentials for Vercel deploys.

## Do
- Use `corepack pnpm install --frozen-lockfile` and commit lockfile-only dependency changes.
- Run `pnpm lint`, `pnpm test`, and `pnpm build` (which runs `prisma generate`) with required envs from `.env.example`; stub or guard `POSTGRES_PRISMA_URL` so builds don’t hard-fail when DB access is unavailable.
- Fail fast on missing envs or schema drift; surface clear messaging instead of proceeding with partial state.
- Keep CI logs free of secrets; prefer masked env vars and minimal output.

## Don't
- Commit `.env` files, credentials, or service tokens; only document env keys in `.env.example`.
- Add non-deterministic steps (random seeds, time-sensitive snapshots) without pinning inputs.
- Skip lint/test/build gates for app-affecting changes.

## Checklist before PR
- [ ] CI commands use pnpm with the existing lockfile and run deterministically.
- [ ] `POSTGRES_PRISMA_URL` handling is guarded (placeholder/skip) so `prisma generate` does not block builds without a DB.
- [ ] No secrets or `.env` files are present in the repo or logs.
