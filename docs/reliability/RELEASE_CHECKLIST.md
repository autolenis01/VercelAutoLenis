# Release Checklist

Run before merging to `main`:

## Local Verification
- [ ] `pnpm install --frozen-lockfile` (no warnings)
- [ ] `pnpm build` (exits 0, no errors)
- [ ] `pnpm typecheck` (no errors)
- [ ] `pnpm lint:changed` (blocking issues fixed)

## Prisma
- [ ] `pnpm prisma validate` (schema correct)
- [ ] `pnpm prisma format` (schema formatted)

## Security
- [ ] No secrets in `.env.example` or committed files
- [ ] No `console.log` with sensitive data
- [ ] All API keys use `process.env.X` (not hardcoded)

## CI/Vercel
- [ ] CI workflow passes on PR
- [ ] Vercel preview build succeeds
- [ ] No new warnings in build logs

## Deployment
- [ ] All required env vars set in Vercel project settings
- [ ] Database migrations applied (if schema changed)
- [ ] Vercel production deploy succeeds
- [ ] Health check passes: `curl https://autolenis.com/api/health`
