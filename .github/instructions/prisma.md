# Prisma

- Update `prisma/schema.prisma` with formatted schema (`pnpm prisma format`).
- Generate clients only after validation passes (`pnpm prisma generate`).
- Add or adjust migrations when schema changes; keep generated clients out of version control.
- Ensure database env vars are documented in `.env.example`; never commit real credentials or `.env`.
- If Prisma generation is blocked, fix schema issues before merging rather than skipping the generate step.
- If validation is temporarily failing upstream, document the blocker in the PR and avoid merging until it is resolved.
