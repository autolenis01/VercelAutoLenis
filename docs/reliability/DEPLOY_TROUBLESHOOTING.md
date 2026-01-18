# Deployment Troubleshooting Guide

## Known Failure Classes

### 1. CI: "Unable to locate executable file: pnpm"
**Cause:** pnpm setup runs after Node cache declaration.
**Fix:** Corepack must enable pnpm BEFORE `setup-node` with `cache: "pnpm"`.
**Prevention:** Never change `.github/workflows/ci.yml` step order.

### 2. Build: "Environment variable X is required"
**Cause:** Module-level env validation in `lib/env.ts` before Vercel injects vars.
**Fix:** All env access must be lazy (via Proxy getter).
**Prevention:** Never add module-level `const x = process.env.Y` in `lib/`.

### 3. Build: "Stripe/SendGrid/Resend not configured"
**Cause:** SDK initialization at module import time.
**Fix:** Use `getStripe()`, `initResend()`, `initSendGrid()` lazy getters.
**Prevention:** All external SDK clients must be lazy-loaded.

### 4. Build: Prisma URL protocol error
**Cause:** `POSTGRES_PRISMA_URL` missing or wrong protocol.
**Fix:** Must be `postgresql://user:pass@host:5432/db?schema=public`.
**Prevention:** CI uses placeholder URL; never override in build scripts.

### 5. Build: Network call during static generation
**Cause:** API routes/sitemaps query database at build time.
**Fix:** Add `export const dynamic = "force-dynamic"` to route.
**Prevention:** No fetch/DB calls in top-level page/route code.

## How to Reproduce Locally

```bash
# Test build without environment variables (should fail gracefully):
pnpm build

# Test with minimal env (should succeed):
export POSTGRES_PRISMA_URL="postgresql://localhost:5432/placeholder"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"
export NEXT_PUBLIC_SUPABASE_URL="http://localhost"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="anon"
# ... (add other required vars from .env.example)
pnpm build
```

## Repo Rules

1. **No build-time secrets:** JWT_SECRET, STRIPE_SECRET_KEY, etc. must only be accessed at runtime.
2. **No build-time network:** No fetch(), no Supabase queries in top-level code.
3. **Lazy everything:** All SDKs (Stripe, Supabase, email) must use lazy initialization.
4. **Dynamic routes:** Add `export const dynamic = "force-dynamic"` to any route that accesses env vars or DB.
