# CI, Builds, and Vercel

- Use deterministic installs: `pnpm install --frozen-lockfile`. Keep `pnpm-lock.yaml` in sync with `package.json`; avoid Bun-based installs unless formally adopted.
- Standard checks: `pnpm lint`, `pnpm test`/`pnpm vitest`, and `pnpm build`. Fix Prisma schema issues before running `pnpm prisma generate` in CI.
- CI and Vercel must source secrets from managed envs only. Do not commit `.env`; update `.env.example` when variables change.
- Prefer failing fast on missing env or schema drift to avoid silent Vercel/CI regressions.
