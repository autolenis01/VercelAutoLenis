# Vercel Environment Variables Checklist

## Required Environment Variables

These environment variables **MUST** be set in both **Preview** and **Production** environments in Vercel:

### Authentication & Security
- `JWT_SECRET` - **Required in Preview + Production** - JWT session signing secret (min 32 characters)
- `CRON_SECRET` - **Required in Preview + Production** - Secret for validating cron job requests

### Database
- `POSTGRES_PRISMA_URL` - **Required in Preview + Production** - PostgreSQL connection URL with protocol `postgresql://`
- `DATABASE_URL` - **Required in Preview + Production** - Database connection URL (can be same as POSTGRES_PRISMA_URL)

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - **Required in Preview + Production** - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - **Required in Preview + Production** - Supabase anonymous/public key
- `SUPABASE_URL` - **Required in Preview + Production** - Supabase project URL (server-side)
- `SUPABASE_ANON_KEY` - **Required in Preview + Production** - Supabase anon key (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - **Required in Preview + Production** - Supabase service role key (admin access)

### Stripe Payments
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - **Required in Preview + Production** - Stripe publishable key
- `STRIPE_SECRET_KEY` - **Required in Preview + Production** - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - **Required in Preview + Production** - Stripe webhook signing secret

### Email (Choose one)
- `RESEND_API_KEY` - **Required in Preview + Production** - Resend email service API key
- OR `SENDGRID_API_KEY` - **Required in Preview + Production** - SendGrid email service API key

### Application
- `NEXT_PUBLIC_APP_URL` - **Required in Preview + Production** - Full application URL (e.g., `https://autolenis.com`)

## Environment-Specific Notes

### Preview Environment
- Use **test/sandbox** credentials for Stripe (starts with `pk_test_` and `sk_test_`)
- Use a **separate** database from production
- JWT_SECRET should be **different** from production

### Production Environment
- Use **live** Stripe credentials (starts with `pk_live_` and `sk_live_`)
- Use the **production** database
- JWT_SECRET should be a **strong**, unique secret (min 32 characters, use `openssl rand -base64 32`)

## How to Set in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate value
4. Select the environment(s) where it should be available:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development (optional, for local Vercel dev)

## Verification

After setting environment variables:

1. Trigger a new deployment (push to branch or redeploy)
2. Check build logs for any missing environment variable errors
3. Test the application to ensure all features work correctly

## Common Issues

### "JWT_SECRET is not configured in production"
- **Cause**: JWT_SECRET not set in Vercel or set only for Production but not Preview
- **Fix**: Add JWT_SECRET to both Production AND Preview environments

### "Stripe/Supabase not configured"
- **Cause**: API keys not set or set incorrectly
- **Fix**: Verify all Stripe and Supabase variables are set in both environments

### Build fails with environment validation errors
- **Cause**: Required variables missing or malformed
- **Fix**: Check all required variables are set and match the expected format
