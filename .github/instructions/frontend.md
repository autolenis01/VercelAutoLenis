# Frontend (Next.js App Router + TypeScript)

- Default to Server Components; add `"use client"` only when required for interactivity.
- Keep data-fetching/server actions on the server; avoid leaking env values to the client. Public envs must be prefixed with `NEXT_PUBLIC_` and documented in `.env.example`.
- Use `pnpm` for dependency changes. Do not switch to Bun unless explicitly approved.
- Follow existing UI patterns (Tailwind + shadcn/ui). Include screenshots in PRs when visual changes occur.
- Run `pnpm lint` and relevant tests for touched components before submitting.
