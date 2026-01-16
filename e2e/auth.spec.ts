import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should display signup form", async ({ page }) => {
    await page.goto("/auth/signup")

    await expect(page.locator("h1")).toContainText("Sign Up")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("should display signin form", async ({ page }) => {
    await page.goto("/auth/signin")

    await expect(page.locator("h1")).toContainText("Sign In")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/auth/signup")

    await page.locator('button[type="submit"]').click()

    // Check for validation messages
    await expect(page.locator("text=/required/i").first()).toBeVisible()
  })

  test("should navigate between signin and signup", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.locator("text=/sign up/i").click()
    await expect(page).toHaveURL(/signup/)

    await page.locator("text=/sign in/i").click()
    await expect(page).toHaveURL(/signin/)
  })
})

test.describe("Protected Routes", () => {
  test("should redirect to signin when accessing protected route", async ({ page }) => {
    await page.goto("/buyer/dashboard")

    // Should redirect to signin
    await expect(page).toHaveURL(/signin/)
  })

  test("should redirect to signin when accessing admin route", async ({ page }) => {
    await page.goto("/admin/dashboard")

    // Should redirect to admin signin
    await expect(page).toHaveURL(/admin\/sign-in/)
  })
})
