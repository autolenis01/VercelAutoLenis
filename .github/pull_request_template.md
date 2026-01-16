## Summary
Describe the change, why it is needed, and link the issue or acceptance criteria being satisfied.

## Acceptance Criteria
- [ ] Requirements in the linked issue are satisfied.
- [ ] No secrets committed (.env stays local; update `.env.example` when adding envs).
- [ ] Prisma schema changes are formatted (`pnpm prisma format`).
- [ ] Prisma client is regenerated after validation passes (`pnpm prisma generate`) when the schema changes.
- [ ] If no schema changes were needed, note that explicitly.
- [ ] CI-ready: deterministic install/build using `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`/`pnpm vitest`, and `pnpm build` where applicable.

## Verification
- [ ] `pnpm install --frozen-lockfile` (note blockers such as schema validation in the PR description).
- [ ] `pnpm lint`
- [ ] `pnpm test` or `pnpm vitest`
- [ ] `pnpm build`
- [ ] Screenshots attached for any UI changes.
