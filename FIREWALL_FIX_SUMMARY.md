# Firewall Connection Issues - Fix Summary

## Problem
The Copilot coding agent was being blocked by firewall rules when attempting to access external services during builds and operations. This occurred multiple times during issue #18, preventing the agent from completing its work.

## Root Causes Identified

### 1. External QR Code Service (api.qrserver.com)
**Location:** `lib/admin-auth.ts:301`
- The code was making HTTP requests to `https://api.qrserver.com/v1/create-qr-code/` to generate QR codes for MFA enrollment
- This external dependency could be blocked by firewalls in CI/CD environments

### 2. Email Service API Calls
**Location:** `lib/services/email.service.tsx`
- Direct fetch calls to `https://api.resend.com/emails` (line 58)
- Direct fetch calls to `https://api.sendgrid.com/v3/mail/send` (line 84)
- No timeout handling, causing hanging requests when firewalls block the connections
- No graceful degradation for network issues

### 3. Internal API Calls without Timeout
**Location:** `proxy.ts:15`
- Affiliate click tracking was making fetch calls without timeout handling
- While an internal API, it could still hang in edge cases

## Solutions Implemented

### 1. Replace External QR Code Service with Local Generation
**File:** `lib/admin-auth.ts`

**Before:**
```typescript
export async function generateQrCodeDataUrl(uri: string): Promise<string> {
  const encoded = encodeURIComponent(uri)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`
}
```

**After:**
```typescript
export async function generateQrCodeDataUrl(uri: string): Promise<string> {
  // Use local QR code generation to avoid external API calls that may be blocked by firewalls
  const QRCode = await import('qrcode')
  return QRCode.toDataURL(uri, { width: 200, margin: 1 })
}
```

**Benefits:**
- No external HTTP requests during MFA enrollment
- Uses existing `qrcode` package (already in dependencies)
- Generates QR codes locally and returns data URLs
- Consistent with how QR codes are generated elsewhere in the codebase (see `app/buyer/affiliate/page.tsx` and `app/affiliate/portal/link/page.tsx`)

### 2. Add Timeout and Error Handling to Email Services
**File:** `lib/services/email.service.tsx`

**Changes for Resend API:**
```typescript
private async sendViaResend(options: EmailOptions & { from: string }) {
  // Add timeout to prevent hanging on firewall blocks
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch("https://api.resend.com/emails", {
      // ... existing options
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    // ... rest of the logic
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Resend API request timed out - possible firewall block')
    }
    throw error
  }
}
```

**Similar changes for SendGrid API**

**Benefits:**
- 10-second timeout prevents indefinite hanging
- AbortController allows graceful cancellation of fetch requests
- Clear error messages indicate when a timeout/firewall block occurs
- Cleanup of timeout handlers in all code paths

### 3. Add Timeout to Internal Affiliate Click Tracking
**File:** `proxy.ts`

**Before:**
```typescript
fetch(`${request.nextUrl.origin}/api/affiliate/click`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: ref }),
}).catch((err) => {
  console.error("[v0] Failed to track affiliate click:", err)
})
```

**After:**
```typescript
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

fetch(`${request.nextUrl.origin}/api/affiliate/click`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: ref }),
  signal: controller.signal,
})
  .then(() => clearTimeout(timeoutId))
  .catch((err) => {
    clearTimeout(timeoutId)
    console.error("[v0] Failed to track affiliate click:", err)
  })
```

**Benefits:**
- 5-second timeout for non-critical tracking
- Prevents middleware delays if internal API is slow
- Maintains error logging

## Testing Recommendations

1. **QR Code Generation:**
   - Navigate to `/admin/mfa/enroll` and verify QR codes are generated properly
   - Check that the generated QR codes work with authenticator apps (Google Authenticator, Authy, etc.)

2. **Email Services:**
   - Trigger various email sends (welcome emails, password reset, etc.)
   - Verify emails are sent successfully with Resend or SendGrid
   - Test timeout behavior by temporarily blocking API access in a test environment

3. **Affiliate Tracking:**
   - Visit a referral link (e.g., `/ref/TESTCODE`)
   - Verify click tracking works without delays
   - Check that middleware doesn't hang if the API is slow

## Impact

### Before
- External QR code API dependency: **1 external service**
- Email API calls without timeout: **2 potential hang points**
- Affiliate tracking without timeout: **1 potential hang point**
- Total firewall-sensitive operations: **4**

### After
- External QR code API dependency: **0** (local generation)
- Email API calls with 10s timeout: **2 with graceful failure**
- Affiliate tracking with 5s timeout: **1 with graceful failure**
- Total firewall-sensitive operations: **3 with proper error handling**

### Risk Reduction
- **100% reduction** in QR code generation firewall risk (now local)
- **Significant reduction** in email service hang risk (10s max instead of indefinite)
- **Improved observability** with timeout error messages that indicate firewall blocks

## Files Changed
1. `lib/admin-auth.ts` - QR code generation
2. `lib/services/email.service.tsx` - Email service timeout handling
3. `proxy.ts` - Affiliate click tracking timeout

## Dependencies
All solutions use existing dependencies:
- `qrcode` package (already in package.json)
- Native `AbortController` and `setTimeout` (built-in to Node.js/browsers)

## Future Improvements
1. Consider adding retry logic with exponential backoff for email services
2. Add monitoring/alerting for timeout events
3. Consider implementing a fallback email provider if primary times out
4. Add circuit breaker pattern for repeated failures
