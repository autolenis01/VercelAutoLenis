# Purpose
- Keep UI changes consistent with the Next.js App Router stack (TypeScript, server-first) and the shared components in `components/ui`.

## Do
- Prefer server components; add `"use client"` only when hooks or browser APIs are required.
- Reuse primitives from `components/ui` and existing patterns for forms (react-hook-form + zod) and theming (`theme-provider`, `skip-link` for accessibility).
- Keep styling in Tailwind utility classes or shared styles; co-locate small helpers in `components` or `hooks` instead of new design systems.
- Ensure client-facing code never embeds secrets; reference env vars only via safe `NEXT_PUBLIC_*` values defined in `.env.example`.

## Don't
- Introduce new UI libraries or inline styles that bypass the shared component set without prior approval.
- Fetch sensitive data directly in client components or leak credentials in logs.
- Commit `.env` files or credentials—document keys only in `.env.example`.

## Checklist before PR
- [ ] UI changes reuse `components/ui` primitives and match existing accessibility patterns.
- [ ] New env needs are documented in `.env.example`; no `.env` or secrets are committed.
- [ ] Added/updated components are typed (TS) and covered by existing lint/test suites when applicable.
