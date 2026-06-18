# CoursePulse AI

A responsible AI-powered faculty learning intelligence tool. Students submit weekly reflections; faculty see only aggregated class-wide learning patterns — no individual student data, no grading, no surveillance.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind + shadcn/ui, Recharts

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — DB schema (courseContext, reflections, classifiedSignals, facultyActions)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/classifier.ts` — Rule-based reflection classifier
- `artifacts/coursepulse/src/` — React frontend

## Architecture decisions

- Rule-based classifier maps reflection text → learning signal (Comprehension, Definitional Confusion, Application Gap, Transfer Gap, Pacing Concern, Support Need, Engagement Signal) with severity 0–3
- Faculty access uses a simple shared access code ("faculty-demo") — no full auth system per MVP spec
- All faculty views show only aggregated data; no individual student records are ever surfaced
- Dashboard stats computed server-side in a single GET /faculty/dashboard endpoint for simplicity
- Reflections are classified at submission time and stored in classified_signals table

## Product

- **Student flow:** Submit weekly reflection → auto-classified by rule-based engine → thank-you confirmation
- **Faculty flow:** Enter access code → view aggregated dashboard (charts, stat cards, recommendations) → manage course context → record instructional actions in impact tracker
- **Governance page:** Full responsible use statement; ethics note on every faculty page

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run codegen after changing openapi.yaml
- Faculty access code is "faculty-demo" (hardcoded in routes/faculty.ts)
- The classifier is in `artifacts/api-server/src/lib/classifier.ts` — severity is adjusted by confidence score

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
