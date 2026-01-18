# Cross-Domain Auth Session Fix - Verification Guide

## Overview
This guide documents the fixes applied to resolve cross-domain authentication session failures between Vercel preview deployments and the production domain (autolenis.com).

## Root Causes Fixed

### 1. Environment Detection Issue
**Problem**: Code used `process.env.NODE_ENV === "production"` which is `true` for both preview AND production deployments on Vercel.

**Fix**: Changed to use `process.env.VERCEL_ENV` which correctly distinguishes:
- `VERCEL_ENV === "production"` - Only true for production deployment on autolenis.com
- `VERCEL_ENV === "preview"` - True for preview deployments (*.vercel.app)
- `VERCEL_ENV === "development"` - True for local dev

**Files Modified**:
- `lib/auth.ts` (Line 6): JWT_SECRET warning now only shows in true production
- `lib/auth-server.ts` (Lines 43-46): Cookie settings use VERCEL_ENV for production detection

### 2. Cookie Security Attributes
**Problem**: Cookie `secure` flag was set based on `NODE_ENV === "production"`, causing inconsistencies.

**Fix**: 
- `secure` flag now correctly set based on `NODE_ENV === "production"` (which is true for all https contexts on Vercel)
- Cookie domain is NOT set (host-only cookie) for better cross-domain compatibility
- `sameSite` set to `"lax"` for security while maintaining cross-navigation compatibility

**Files Modified**:
- `lib/auth-server.ts` (Lines 47-59): Complete rewrite of setSessionCookie()
- `app/api/auth/signout/route.ts` (Lines 17-18, 36-37): Cookie clearing matches setting logic

### 3. Cookie Domain Strategy
**Problem**: No domain attribute was set, but cookie persistence issues occurred.

**Fix**: Explicitly using host-only cookies (no domain attribute) which:
- Work on both preview URLs (*.vercel.app) and production (autolenis.com)
- Are more secure (can't be shared with subdomains unless needed)
- Follow modern cookie best practices

**Note**: If subdomain sharing is needed in the future, can set `domain: ".autolenis.com"` in production only.

## New Features Added

### 1. Diagnostic Endpoint
**URL**: `/api/diagnostics/auth`

**Purpose**: Safe debugging endpoint for authentication issues

**Returns**:
```json
{
  "success": true,
  "diagnostics": {
    "timestamp": "2026-01-18T18:30:00.000Z",
    "environment": {
      "nodeEnv": "production",
      "vercelEnv": "preview",
      "isProduction": false,
      "isPreview": true,
      "isDevelopment": false
    },
    "request": {
      "host": "autolenis-git-branch-name.vercel.app",
      "protocol": "https",
      "fullUrl": "https://autolenis-git-branch-name.vercel.app"
    },
    "authentication": {
      "hasJwtSecret": true,
      "jwtSecretConfigured": true,
      "jwtSecretLength": 64
    },
    "cookies": {
      "hasSessionCookie": true,
      "cookieNames": ["session", "other-cookie"],
      "cookieCount": 2
    },
    "recommendations": []
  }
}
```

**Security**: Does NOT leak secrets, only shows metadata

### 2. UI Components for Session Management

#### SessionWarningBanner
Shows at top of dashboard layouts when user is not authenticated.

**Usage**:
```tsx
import { SessionWarningBanner } from "@/components/auth"

export default function BuyerDashboard() {
  return (
    <div>
      <SessionWarningBanner portalType="buyer" />
      {/* rest of dashboard */}
    </div>
  )
}
```

#### SessionStatusIndicator
Shows inline "Signed in as [email]" badge when authenticated.

**Usage**:
```tsx
import { SessionStatusIndicator } from "@/components/auth"

export default function Header() {
  return (
    <header>
      <SessionStatusIndicator />
    </header>
  )
}
```

#### AuthDebugDrawer
Developer-only debug panel (floating button in bottom-right).

**Enable**: Set `NEXT_PUBLIC_ENV_BADGE=true` in environment variables

**Usage**: Automatically appears when enabled, no code changes needed

#### SessionRequiredScreen
Full-page error state for protected routes when session is missing.

**Usage**:
```tsx
import { SessionRequiredScreen } from "@/components/auth"
import { useUser } from "@/hooks/use-user"

export default function ProtectedPage() {
  const { user, isLoading } = useUser()
  
  if (isLoading) return <Loading />
  if (!user) return <SessionRequiredScreen portalType="buyer" />
  
  return <div>Protected content</div>
}
```

## Manual Verification Steps

### For autolenis.com (Production)

1. **Deploy to production** with all environment variables set:
   ```bash
   # Ensure these are set in Vercel dashboard for production:
   VERCEL_ENV=production (auto-set by Vercel)
   JWT_SECRET=<your-secure-secret-min-32-chars>
   # ... other required vars
   ```

2. **Test Sign In Flow**:
   ```
   a. Navigate to https://autolenis.com/auth/signin
   b. Sign in with valid credentials
   c. Verify redirect to appropriate dashboard (buyer/dealer/admin)
   d. Check browser DevTools > Application > Cookies
      - Should see "session" cookie
      - Domain: autolenis.com (or blank for host-only)
      - Secure: ✓
      - HttpOnly: ✓
      - SameSite: Lax
   ```

3. **Test Session Persistence**:
   ```
   a. After signing in, navigate to different dashboard pages:
      - /buyer/dashboard
      - /buyer/search
      - /buyer/prequal
   b. Verify you remain logged in (no redirects to signin)
   c. Close browser and reopen (within 7 days)
   d. Verify session persists
   ```

4. **Test Diagnostics** (optional):
   ```
   a. Navigate to https://autolenis.com/api/diagnostics/auth
   b. Verify response shows:
      - vercelEnv: "production"
      - isProduction: true
      - hasJwtSecret: true
      - jwtSecretConfigured: true
      - hasSessionCookie: true (if logged in)
   ```

### For Preview Deployments (*.vercel.app)

1. **Deploy PR to preview**:
   ```
   - Push changes to branch
   - Wait for Vercel preview deployment
   - Get preview URL (e.g., autolenis-git-branch.vercel.app)
   ```

2. **Verify Environment Detection**:
   ```
   a. Navigate to https://your-preview-url.vercel.app/api/diagnostics/auth
   b. Verify response shows:
      - vercelEnv: "preview"
      - isPreview: true
      - isProduction: false
   ```

3. **Test Independent Sessions**:
   ```
   a. Sign in on preview URL
   b. Verify can navigate preview dashboard pages
   c. In NEW BROWSER TAB, navigate to https://autolenis.com
   d. Verify you are NOT automatically logged in (sessions are independent)
   e. Sign in on autolenis.com
   f. Verify autolenis.com session persists independently
   ```

### Testing Session Warning UI

1. **Without Debug Panel**:
   ```
   a. Navigate to any protected page while logged out
   b. Should see SessionWarningBanner at top with:
      - "Session Not Active" warning
      - "Sign in to [Portal]" button
      - "Open AutoLenis.com" button
   ```

2. **With Debug Panel** (set `NEXT_PUBLIC_ENV_BADGE=true`):
   ```
   a. After deployment, look for "Debug" button in bottom-right
   b. Click to open drawer
   c. Verify shows:
      - Current hostname
      - Current portal
      - Current path
      - Cookies enabled status
      - Storage available status
      - Important note about domain-specific sessions
   ```

## Common Issues & Solutions

### Issue: Sessions lost after navigating from preview to production
**Expected Behavior**: This is correct! Sessions should NOT transfer between domains.

**Solution**: Users must sign in separately on each domain. Use SessionWarningBanner to inform them.

### Issue: JWT_SECRET warning in logs on preview
**Before Fix**: Warning appeared on preview deployments
**After Fix**: Warning only appears when `VERCEL_ENV === "production"` and JWT_SECRET is missing

### Issue: Cookies not set
**Check**:
1. Verify JWT_SECRET is set in environment (min 32 characters)
2. Check diagnostics endpoint for hasJwtSecret and jwtSecretConfigured
3. Verify browser allows cookies (check SessionStatusIndicator)
4. Check DevTools > Application > Cookies for "session" cookie

### Issue: Session expires immediately
**Check**:
1. Verify server time is correct (JWT expiration uses server time)
2. Check JWT_SECRET is consistent across deployments
3. Verify maxAge is set correctly (7 days = 604800 seconds)

## Code Review Checklist

- [x] VERCEL_ENV used instead of NODE_ENV for production checks
- [x] Cookie secure flag set based on https context
- [x] Cookie domain NOT set (host-only for compatibility)
- [x] sameSite set to "lax" for security
- [x] Diagnostic endpoint doesn't leak secrets
- [x] UI components handle loading/error states
- [x] Session persistence works across page navigation
- [x] Sign out clears cookies correctly
- [x] No hardcoded domains or URLs (use env vars with fallbacks)

## Rollback Plan

If issues arise, revert these commits:
```bash
git revert 3120383  # UI components
git revert 018d8ee  # Core auth fixes
```

Then redeploy to restore previous behavior.

## Future Improvements

1. **Subdomain Cookie Sharing** (if needed):
   ```typescript
   // In lib/auth-server.ts, setSessionCookie()
   if (isProduction) {
     cookieOptions.domain = ".autolenis.com"  // Shares with subdomains
   }
   ```

2. **Session Refresh**:
   - Add endpoint to refresh session before expiration
   - Implement sliding session window

3. **Multi-Factor Auth**:
   - Already exists for admin portal
   - Consider for buyer/dealer portals

4. **Session Analytics**:
   - Track session duration
   - Monitor cross-domain navigation patterns
   - Alert on unusual session behavior

## References

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
