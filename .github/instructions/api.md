# API (App Router route handlers)

- Keep handlers TypeScript-first and typed; validate inputs with existing schemas (e.g., Zod) and return structured errors.
- Enforce authentication/authorization using existing middleware/utilities; never log or echo secrets.
- Access secrets only on the server. Update `.env.example` when new env vars are required and keep `.env` untracked.
- Prefer deterministic installs/runs with `pnpm`. Add focused tests for new endpoints or edge cases.
