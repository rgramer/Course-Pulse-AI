# Source Code Inventory

This file maps the major source-code areas in the actual GitHub repository.

| Area | Path | Notes |
|---|---|---|
| Root workspace | `package.json`, `pnpm-workspace.yaml`, `tsconfig*.json` | pnpm monorepo configuration. |
| API server | `artifacts/api-server/` | Express server, routes, middleware, classifier, logging, build script. |
| Frontend app | `artifacts/coursepulse/` | React/Vite app, pages, components, styles, frontend routing. |
| Mockup sandbox | `artifacts/mockup-sandbox/` | Replit-generated preview/sandbox artifacts. |
| Database schema | `lib/db/src/schema/` | Drizzle PostgreSQL schema for course context, reflections, classified signals, and faculty actions. |
| API spec | `lib/api-spec/openapi.yaml` | Source API contract for generated client code. |
| React API client | `lib/api-client-react/` | Generated React Query client. Do not manually edit generated files. |
| Zod API types | `lib/api-zod/` | Generated/validated API schemas. |
| AI integration | `lib/integrations-anthropic-ai/` | Anthropic client used by the syllabus extraction route. |
| Seed/demo script | `scripts/src/seed.ts` | Populates demo data matching the presentation/report examples. |
| Demo script | `CoursePulse_Demo_Script.md` | Presenter script for the MVP walkthrough. |
| Replit notes | `replit.md` | Original project operation notes and gotchas. |

## Most important files for review

- `artifacts/api-server/src/lib/classifier.ts`
- `artifacts/api-server/src/routes/reflections.ts`
- `artifacts/api-server/src/routes/faculty.ts`
- `artifacts/api-server/src/routes/courseContext.ts`
- `artifacts/api-server/src/routes/syllabus.ts`
- `artifacts/coursepulse/src/pages/index.tsx`
- `artifacts/coursepulse/src/pages/governance.tsx`
- `lib/db/src/schema/reflections.ts`
- `lib/db/src/schema/classifiedSignals.ts`
- `lib/db/src/schema/courseContext.ts`
- `scripts/src/seed.ts`
