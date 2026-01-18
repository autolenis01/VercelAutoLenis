// Edge-compatible JWT utilities using Web Crypto API directly
// Used by middleware - does not depend on 'jose' package

export interface SessionUser {
  userId: string
  email: string
  role: string
  is_affiliate?: boolean
}

function base64UrlDecode(str: string): Uint8Array {
  // Add padding if needed
  const padding = "=".repeat((4 - (str.length % 4)) % 4)
  const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env["JWT_SECRET"] || "your-secret-key-change-in-production"
  const encoder = new TextEncoder()
  return await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ])
}

export async function verifySessionEdge(token: string): Promise<SessionUser> {
  const parts = token.split(".")
  if (parts.length !== 3) {
    throw new Error("Invalid token format")
  }

  const [headerB64, payloadB64, signatureB64] = parts
  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new Error("Invalid token parts")
  }

  // Verify signature
  const key = await getKey()
  const encoder = new TextEncoder()
  const data = encoder.encode(`${headerB64}.${payloadB64}`)
  const signature = base64UrlDecode(signatureB64)

  const signatureBuffer = signature.buffer.slice(0) as ArrayBuffer
  const isValid = await crypto.subtle.verify("HMAC", key, signatureBuffer, data)
  if (!isValid) {
    throw new Error("Invalid signature")
  }

  // Decode payload
  const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64))
  const payload = JSON.parse(payloadJson)

  // Check expiration
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired")
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    is_affiliate: payload.is_affiliate || false,
  }
}
