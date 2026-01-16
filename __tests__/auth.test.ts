import { describe, it, expect, beforeAll } from "vitest"
import { AuthService } from "@/lib/services/auth.service"

describe("Authentication Service", () => {
  let authService: AuthService

  beforeAll(() => {
    authService = new AuthService()
  })

  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "TestPassword123!"
      const hash = await authService.hashPassword(password)

      expect(hash).toBeTruthy()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50)
    })

    it("should verify correct password", async () => {
      const password = "TestPassword123!"
      const hash = await authService.hashPassword(password)
      const isValid = await authService.verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it("should reject incorrect password", async () => {
      const password = "TestPassword123!"
      const wrongPassword = "WrongPassword123!"
      const hash = await authService.hashPassword(password)
      const isValid = await authService.verifyPassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })
  })

  describe("Email Validation", () => {
    it("should accept valid email addresses", () => {
      const validEmails = ["test@example.com", "user+tag@domain.co.uk", "name.surname@company.com"]

      validEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it("should reject invalid email addresses", () => {
      const invalidEmails = ["notanemail", "@nodomain.com", "missing@domain", "spaces in@email.com"]

      invalidEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe("JWT Token Generation", () => {
    it("should generate valid JWT token", async () => {
      const userId = "test-user-123"
      const email = "test@example.com"
      const role = "BUYER"

      const token = await authService.generateToken({ userId, email, role })

      expect(token).toBeTruthy()
      expect(typeof token).toBe("string")
      expect(token.split(".").length).toBe(3) // JWT has 3 parts
    })
  })
})

describe("Authentication API Integration", () => {
  describe("POST /api/auth/signup", () => {
    it("should reject signup with missing fields", async () => {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          // Missing password
        }),
      })

      expect(response.status).toBe(400)
    })

    it("should reject signup with invalid email", async () => {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email",
          password: "ValidPass123!",
          firstName: "Test",
          lastName: "User",
          role: "BUYER",
        }),
      })

      expect(response.status).toBe(400)
    })

    it("should reject signup with weak password", async () => {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "weak",
          firstName: "Test",
          lastName: "User",
          role: "BUYER",
        }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe("POST /api/auth/signin", () => {
    it("should reject signin with missing credentials", async () => {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          // Missing password
        }),
      })

      expect(response.status).toBe(400)
    })

    it("should reject signin with invalid credentials", async () => {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "WrongPassword123!",
        }),
      })

      expect(response.status).toBe(401)
    })
  })

  describe("Rate Limiting", () => {
    it("should rate limit after too many failed login attempts", async () => {
      const email = "ratelimit-test@example.com"

      // Make 6 rapid requests (limit is 5 per 15 minutes)
      const requests = Array.from({ length: 6 }, () =>
        fetch("http://localhost:3000/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: "WrongPassword123!",
          }),
        }),
      )

      const responses = await Promise.all(requests)
      const lastResponse = responses[responses.length - 1]

      expect(lastResponse.status).toBe(429) // Too Many Requests
    })
  })
})
