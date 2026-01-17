Definition of Done (DoD): Production-Ready — VercelAutoLenis

1) Build & Deploy (Non-Negotiable)
	•	Vercel deploy succeeds from the default branch (e.g., main) with standard settings.
	•	pnpm install --frozen-lockfile succeeds on a clean environment.
	•	pnpm build succeeds on a clean environment without requiring private env vars (except the explicitly documented minimum set).
	•	No build step depends on network access (fonts, remote fetch, etc.) unless explicitly gated and optional.
	•	Prisma generate cannot hard-fail when POSTGRES_PRISMA_URL is missing (must be guarded).
	•	No ignoreBuildErrors / “skip typecheck” hacks are enabled in production configuration unless:
	•	explicitly documented with a linked issue, and
	•	time-boxed with a removal plan.

2) Repository Hygiene & Determinism
	•	pnpm-lock.yaml is committed and matches dependencies (no drift).
	•	The repo uses one package manager in CI/deploy (pnpm). No mixed bun/npm install flows.
	•	No hidden local dependencies (build must work from a fresh clone).
	•	README/setup docs include the minimum env requirements and run commands.

3) Security & Secrets (Hard Rules)
	•	No secrets committed (no .env, tokens, service role keys, private URLs).
	•	All secrets are stored in Vercel Environment Variables (or documented secret manager).
	•	All write endpoints validate input (e.g., Zod) and return safe errors.
	•	Role/ownership enforcement exists for every protected route:
	•	Buyer can only access Buyer-owned records
	•	Dealer can only access Dealer-owned records
	•	Admin endpoints are admin-only
	•	Supabase RLS is enabled on core tables and policies match application flows.
	•	Dependency security: pnpm audit (or equivalent) shows no critical vulnerabilities.

4) Data Integrity & Schema Alignment
	•	Prisma schema validates (pnpm exec prisma validate) in CI (with guarded env).
	•	Migrations are consistent and documented (if used).
	•	No runtime queries reference missing columns/tables (Supabase REST errors resolved).
	•	All API endpoints return consistent shapes and stable error codes.

5) Navigation Integrity (Zero 404 Policy)
	•	No broken links in:
	•	Public site navigation + footer
	•	Buyer dashboard navigation
	•	Dealer dashboard navigation
	•	Affiliate dashboard navigation
	•	Admin dashboard navigation
	•	Every route referenced by href, router.push, redirects, or menus exists or is intentionally removed.
	•	All dynamic routes ([id], etc.) include:
	•	loading state
	•	not-found state (404)
	•	permission/ownership failure state (403/redirect)

6) Portal Completeness (Per Role)

Buyer Portal
	•	Sign-in and sign-out work end-to-end
	•	Dashboard loads with empty state and error state
	•	Profile/settings pages work and persist changes
	•	Deal/shortlist/offers flows do not dead-end
	•	No console errors during standard usage flows

Dealer Portal
	•	Onboarding works end-to-end
	•	Inventory list/detail/edit/add/bulk upload flows work
	•	Auctions list/detail/offers flows work
	•	Contracts list/detail and pickups pages work
	•	Settings works and persists changes

Affiliate Portal
	•	Dashboard renders with tracking data or empty state
	•	Referral link/code is visible and functional
	•	Analytics page loads (no broken queries)
	•	Settings works

Admin Portal
	•	Admin authentication and session enforcement work
	•	Critical admin pages load (users/dealers/approvals/support/settings if present)
	•	No admin navigation leads to missing pages
	•	Sensitive actions are protected and logged (at least server logs)

7) UX Quality Bar (Professional Standard)
	•	Every page has at least:
	•	a loading state
	•	an error state
	•	an empty state (when applicable)
	•	UI is consistent:
	•	typography, spacing, buttons, cards
	•	consistent toasts/alerts
	•	Forms:
	•	labels and validation messages
	•	disabled states for submit while saving
	•	success and failure feedback
	•	Accessibility baseline:
	•	keyboard navigation works
	•	focus states present
	•	form controls labeled

8) Observability & Runtime Stability
	•	Runtime errors are handled gracefully (no blank screens).
	•	Server logs do not leak secrets.
	•	Monitoring (Sentry/etc.) is optional and gated (does not break runtime if unset).
	•	Critical workflows have basic logging or traceability.

9) Verification Commands (Must Pass)

From a clean environment (no private env vars except the documented minimum):
	•	pnpm install --frozen-lockfile
	•	pnpm build
	•	pnpm exec prisma validate (guarded if needed)
	•	Smoke test: open core pages (public + each portal) without 404s

10) Release Sign-Off
	•	A short release note exists (what changed, why, risk, rollback notes).
	•	Vercel deployment URL verified for:
	•	Public homepage
	•	Buyer dashboard
	•	Dealer dashboard
	•	Affiliate dashboard
	•	Admin sign-in + dashboard
