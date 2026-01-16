---

## 2) `AGENTS.md` (Repo runbook for Copilot coding agent)

```md
# AutoLenis Overseer — Agent Runbook (VercelAutoLenis)

This repository uses GitHub Copilot coding agent to keep the project **buildable in CI** and **deployable on Vercel** with **no secrets committed**.

## Canonical Agent Instructions
- `.github/instructions/frontend.instructions.md`
- `.github/instructions/api.instructions.md`
- `.github/instructions/prisma.instructions.md`
- `.github/instructions/ci.instructions.md`

## Golden Rules
1. CI must pass with minimal environment variables.
2. Never commit secrets (no `.env`, no tokens, no credential URLs).
3. Prefer the smallest correct fix; one problem per PR.

---

## Standard Verification Commands (Local)
```bash
pnpm install
pnpm lint
pnpm test || pnpm vitest
pnpm build
