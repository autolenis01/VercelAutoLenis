## Summary (What changed)
- 

## Root Cause (Why)
- 

## Acceptance Criteria
- [ ] `pnpm install` succeeds (CI)
- [ ] `pnpm lint` passes (CI)
- [ ] `pnpm test` / `pnpm vitest` passes (CI) **or** is explicitly skipped with justification
- [ ] `pnpm build` succeeds (CI) without private env vars
- [ ] Vercel build succeeds with standard settings
- [ ] No secrets committed (`.env` remains untracked)

## How to Verify
### Local
```bash
pnpm install
pnpm lint
pnpm test || pnpm vitest
pnpm build
