# CoursePulse AI

CoursePulse AI is a responsible faculty learning-intelligence MVP for converting low-stakes student reflections into aggregated, class-wide instructional signals. Students submit weekly reflections tied to a course week, topic, learning objective, and confidence score. The system classifies the reflection into a learning signal and displays aggregate patterns for faculty decision support.

The MVP is intentionally **not** a grading tool, student-ranking tool, failure-prediction system, or surveillance platform. Faculty-facing views are designed around class-level patterns and instructional improvement.

## Live demo

Replit/demo link: https://replit.com/@Russel91/Course-Pulse-AI

Faculty demo access code: `faculty-demo`

## What is included in this repository

| Area | Location |
|---|---|
| React/Vite frontend | `artifacts/coursepulse/` |
| Express API server | `artifacts/api-server/` |
| Server-side classifier | `artifacts/api-server/src/lib/classifier.ts` |
| API routes | `artifacts/api-server/src/routes/` |
| Database schema | `lib/db/src/schema/` |
| OpenAPI contract and generated clients | `lib/api-spec/`, `lib/api-client-react/`, `lib/api-zod/` |
| Demo seed script | `scripts/src/seed.ts` |
| Sample CSV data for handoff | `data/` |
| Architecture, governance, testing notes | `docs/` |
| Replit operating notes | `replit.md` |

## MVP workflow

1. Student selects a course week/topic and learning objective.
2. Student rates confidence and submits a short reflection.
3. API stores the reflection and classifies it using the server-side learning-signal classifier.
4. Faculty dashboard aggregates learning signals, confidence trends, support requests, confusion topics, and recommended instructional responses.
5. Governance guardrails keep the system focused on faculty decision support rather than individual evaluation.

## Technology stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript |
| Frontend | React, Vite, Tailwind, shadcn/ui, Recharts |
| API | Express 5, pino logging |
| Database | PostgreSQL, Drizzle ORM |
| Validation/API contract | Zod, drizzle-zod, OpenAPI, Orval-generated clients |
| Classification | Rule-based TypeScript classifier in `classifier.ts` |
| Optional syllabus parsing | Anthropic integration plus Mammoth `.docx` text extraction |
| Hosting/demo | Replit |

## Quick start: local development

### 1. Install prerequisites

Use Node.js 24 and pnpm.

```bash
node --version
pnpm --version
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a local `.env` file based on `.env.example`.

At minimum, set:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://api.anthropic.com
AI_INTEGRATIONS_ANTHROPIC_API_KEY=your_key_here
```

The Anthropic values are required by the current server import path because the syllabus route imports the Anthropic integration at startup. If the syllabus upload feature is not being used, a future improvement would be to lazy-load that integration only when syllabus extraction is requested.

### 4. Push database schema

```bash
pnpm --filter @workspace/db run push
```

### 5. Seed demo data

```bash
pnpm --filter @workspace/scripts run seed
```

### 6. Run the API server

```bash
pnpm --filter @workspace/api-server run dev
```

The API server runs on port `8080` in the Replit configuration.

### 7. Run the frontend

In a second terminal:

```bash
pnpm --filter @workspace/coursepulse run dev
```

Open the frontend URL shown by Vite.

## Useful routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/student` | Student reflection submission flow |
| `/faculty-login` | Faculty access-code screen |
| `/faculty/dashboard` | Aggregated dashboard |
| `/faculty/course-context` | Course context management |
| `/faculty/syllabus-upload` | Syllabus upload/import flow |
| `/faculty/impact-tracker` | Faculty instructional-action tracker |
| `/faculty/report` | Aggregated course intelligence report |
| `/governance` | Responsible use statement and boundaries |

## Core governance boundaries

CoursePulse AI is designed to:

- show aggregated instructional patterns only;
- avoid grading or ranking students;
- avoid failure prediction, risk scoring, or at-risk labeling;
- avoid individual student surveillance;
- keep faculty responsible for all instructional decisions;
- use minimum viable data for formative teaching insight.

## Handoff documents

- `CONFIGURATION.md` explains environment setup and commands.
- `KNOWN_LIMITATIONS.md` lists current MVP limitations and production risks.
- `docs/architecture_diagram.png` and `docs/architecture_diagram.md` describe the system flow.
- `docs/governance_note.md` documents responsible use boundaries.
- `docs/testing_notes.md` summarizes the MVP test approach and success criteria.
- `docs/classification_logic.md` explains the current rule-based classifier and how it maps reflections to signals.
- `docs/source_code_inventory.md` maps the important source-code locations.
