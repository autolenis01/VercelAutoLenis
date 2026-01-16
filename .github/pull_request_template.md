## Summary
- [ ] Describe the change and why it is needed.
- [ ] Link the issue or acceptance criteria being satisfied.

## Acceptance Criteria
- [ ] Requirements in the linked issue are satisfied.
- [ ] No secrets committed (.env stays local; update `.env.example` when adding envs).
- [ ] Prisma schema changes are formatted and generated (`pnpm prisma format && pnpm prisma generate`) or explicitly state no schema changes.
- [ ] CI-ready: deterministic install/build using `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test`/`pnpm vitest`, and `pnpm build` where applicable.

## Verification
- [ ] `pnpm install --frozen-lockfile` (note if currently blocked).
- [ ] `pnpm lint`
- [ ] `pnpm test` or `pnpm vitest`
- [ ] `pnpm build`
- [ ] Screenshots attached for any UI changes.
