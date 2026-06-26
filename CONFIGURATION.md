# CoursePulse AI Configuration Guide

This guide documents the configuration needed to run the current CoursePulse AI repository.

## Runtime requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | Node 24, matching `.replit` |
| Package manager | pnpm |
| Database | PostgreSQL 16 in Replit, or any compatible PostgreSQL instance locally |
| Main language | TypeScript |
| Frontend | React + Vite |
| Backend | Express 5 |

## Environment variables

Create `.env` from `.env.example`.

| Variable | Required? | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Drizzle ORM. |
| `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` | Yes for current server startup | Base URL used by the syllabus AI extraction integration. |
| `AI_INTEGRATIONS_ANTHROPIC_API_KEY` | Yes for current server startup | API key used by the syllabus AI extraction integration. |
| `NODE_ENV` | Optional | Set to `development` during local development. |

Important: the current API server imports the syllabus route at startup, and that route imports the Anthropic client. Because the Anthropic client validates its environment variables at import time, local runs currently require the two Anthropic environment variables even if syllabus upload is not being tested.

## Install dependencies

```bash
pnpm install
```

## Database setup

Push the Drizzle schema to the configured PostgreSQL database:

```bash
pnpm --filter @workspace/db run push
```

If needed during development, a force push script is also available:

```bash
pnpm --filter @workspace/db run push-force
```

Use the force command only in a disposable development database.

## Seed demo data

```bash
pnpm --filter @workspace/scripts run seed
```

The seed script populates course context rows, simulated reflections, classified signals, and faculty actions. It is safe to run multiple times because it skips seeding when reflections already exist.

## Start services

Start the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

Start the React frontend:

```bash
pnpm --filter @workspace/coursepulse run dev
```

## Build and typecheck

```bash
pnpm run typecheck
pnpm run build
```

## API contract/code generation

If `lib/api-spec/openapi.yaml` changes, regenerate API hooks and Zod schemas:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Generated files live in:

- `lib/api-client-react/src/generated/`
- `lib/api-zod/src/generated/`

Do not manually edit generated files.

## Faculty access

The MVP uses a single hardcoded faculty access code:

```text
faculty-demo
```

This is defined in `artifacts/api-server/src/routes/faculty.ts` and should be replaced with institutional authentication before production use.
