# Frontend Instructions — VercelAutoLenis (Next.js App Router)

## Scope
Applies to all UI work under:
- `app/**` (pages, layouts, route segments, server/client components)
- `components/**`
- `styles/**`
- Any UI-related `lib/**` utilities

## Primary Objectives
- Keep UI changes small, consistent, and accessible.
- Maintain responsive behavior with zero horizontal overflow.
- Avoid regressions: preserve existing component APIs unless explicitly required.

## Next.js App Router Rules
- Default to **Server Components**; use `"use client"` only when needed (state, effects, browser-only APIs, event handlers).
- Never import server-only modules into client components (e.g., direct database access, Node-only packages).
- Prefer `app/**/loading.tsx` and `app/**/error.tsx` patterns already in the repo when introducing async UI.

## Component & Styling Conventions
- Prefer existing UI primitives in `components/ui/**` (shadcn-style) rather than introducing new patterns.
- Keep styling consistent with existing Tailwind usage and spacing scale.
- Prefer composition over duplication: refactor common layout patterns into small components when it reduces repeated markup.

## Responsive + Layout Non-Negotiables
- No horizontal scroll on mobile. Verify with narrow viewport.
- Use `max-w-*`, `w-full`, `overflow-x-hidden` (only when justified), and sensible grid/flex breakpoints.
- Avoid fixed pixel widths unless necessary; favor responsive constraints.

## Accessibility Requirements
- Buttons/links must have discernible text or `aria-label`.
- Form controls must have labels (visible or `sr-only`), and error messages must be associated.
- Ensure keyboard navigation works for dialogs/menus and focus states are preserved.

## Performance & Bundle Hygiene
- Avoid adding heavy dependencies for UI polish; prefer existing libs.
- Avoid client-side rendering for content that can be server-rendered.
- Avoid unnecessary re-renders; keep state local and minimal.

## Images, Icons, and Assets
- Use `next/image` where appropriate.
- Keep assets in `public/` and reference with stable paths.
- Do not add large unoptimized images.

## Testing Expectations (when UI behavior changes)
- Add/adjust tests for key UI flows when changing logic (e.g., calculators, forms).
- Prefer existing test frameworks in repo (Vitest/Playwright) and follow current patterns.

## Definition of Done (Frontend)
- Typecheck passes.
- No layout regressions at mobile/tablet/desktop.
- No console errors in dev.
- If behavior changed: tests updated/added and passing.
