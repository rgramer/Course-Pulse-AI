# CoursePulse AI

A responsible AI-powered faculty learning intelligence tool. Students submit weekly reflections; faculty see only aggregated class-wide learning patterns — no grading, no ranking, no surveillance, no individual student data.

**Brand color:** NYU Violet `#57068C` (primary), deep hover `#330662`, light tint `#EEE6F3`.

---

## Run & Operate

```bash
pnpm --filter @workspace/api-server run dev    # API server (port 8080, proxied at /api)
pnpm --filter @workspace/coursepulse run dev   # React frontend (port auto-assigned)
pnpm run typecheck                             # Full typecheck across all packages
pnpm run build                                 # Typecheck + build all packages
pnpm --filter @workspace/api-spec run codegen  # Regenerate API hooks and Zod schemas
pnpm --filter @workspace/db run push           # Push DB schema changes (dev only)
```

Required env: `DATABASE_URL` — PostgreSQL connection string (auto-set in Replit).

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| API | Express 5, pino logging |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| API contract | OpenAPI spec → Orval codegen → React Query hooks |
| Frontend | React + Vite + Tailwind v4 + shadcn/ui + Recharts |
| File parsing | mammoth (.docx), multer (upload) |

---

## Where Things Live

```
lib/api-spec/openapi.yaml              — API contract (source of truth)
lib/db/src/schema/                     — DB schema tables
lib/api-client-react/src/generated/   — Generated React Query hooks (do not edit)
lib/api-zod/src/generated/            — Generated Zod schemas (do not edit)
artifacts/api-server/src/routes/      — Express route handlers
artifacts/api-server/src/routes/syllabus.ts — Syllabus upload + heuristic parser
artifacts/api-server/src/lib/classifier.ts  — Rule-based reflection classifier
artifacts/coursepulse/src/            — React frontend
artifacts/coursepulse/src/components/logo.tsx — CoursePulseLogo SVG component
artifacts/coursepulse/src/index.css   — Theme (NYU Violet primary)
```

---

## Student View

**Route:** `/student`

Students submit a short weekly reflection:
- Select the week and topic from a dropdown (populated from course context)
- Rate their confidence (1–5, does not affect grades)
- Write a free-text reflection

On submit, the reflection is auto-classified by the server-side rule-based classifier. Students see a confirmation page with a clear privacy statement.

**Privacy commitments shown to students:**
- Not used for grading
- Not used for ranking
- Not used for failure prediction
- Not shown as an individual student profile

---

## Faculty View

**Access code:** `faculty-demo` (hardcoded for MVP; see `artifacts/api-server/src/routes/faculty.ts`)

### Faculty pages (all auth-gated)

| Route | Purpose |
|---|---|
| `/faculty/dashboard` | Aggregated learning signal charts, filters, weekly pulse, recommendations |
| `/faculty/course-context` | Manage weekly topics and learning objectives |
| `/faculty/syllabus-upload` | Upload .docx syllabus → review extracted rows → import to course context |
| `/faculty/impact-tracker` | Record instructional adjustments made in response to signals |
| `/faculty/report` | Full course intelligence report with impact comparisons |

Every faculty page shows a persistent governance banner:
> "CoursePulse AI shows aggregated instructional patterns only. It does not grade, rank, predict failure, or evaluate individual students."

---

## Syllabus Upload

Faculty can upload a `.docx` or `.txt` syllabus to generate a draft course context instead of typing every row manually.

**Workflow:**
1. Faculty uploads file at `/faculty/syllabus-upload`
2. Server extracts text using **mammoth** (.docx) or plain UTF-8 (.txt)
3. Heuristic parser detects Week headers, topic titles, learning objectives, readings, and assignments
4. Extracted rows shown in a review/edit table — faculty can edit, delete, or add rows
5. Faculty clicks "Import to Course Context" — only approved rows are saved
6. Original file is never stored permanently

**API endpoints (not in OpenAPI spec — frontend uses plain `fetch()`):**
- `POST /api/faculty/syllabus/extract` — multipart, field `file` (.docx/.txt) → `{ rows: ParsedRow[] }`
- `POST /api/faculty/syllabus/import` — JSON `{ rows: ParsedRow[] }` → `{ imported: number }`

**Heuristic parser detects:**
- `Week N` / `Module N` → week number
- Lines after week header → topic
- `Learning Objective`, `Students will`, `By the end of` → learning objective
- `Reading`, `Readings`, `Article`, `Chapter` → reading
- `Assignment`, `Lab`, `Workshop`, `Project`, `Deliverable` → assignment

**MVP limitation:** The parser works best on structured syllabus formats. Non-standard layouts may require faculty correction.

---

## Course Context Management

The Course Context page offers two setup paths:
1. **Manage Manually** — add individual rows via the dialog form
2. **Upload Syllabus** — link to syllabus upload wizard (optional; must review before import)

Both paths save rows to the `course_context` table. Faculty can delete rows from the table at any time.

---

## Classifier

The rule-based classifier (`artifacts/api-server/src/lib/classifier.ts`) maps reflection text to a learning signal:

| Signal | Description |
|---|---|
| Comprehension | Student understood the material |
| Definitional Confusion | Unclear on terminology or definitions |
| Application Gap | Understands concept but can't apply it |
| Transfer Gap | Can't connect to real-world or prior knowledge |
| Pacing Concern | Too fast, too slow, or too much content |
| Support Need | Requests help or office hours |
| Engagement Signal | High interest or curiosity |

Severity is 0–3, adjusted by confidence score. Stored in `classified_signals` table at submission time.

---

## Responsible AI Guardrails

- **Aggregated only:** Faculty dashboard and report show class-wide patterns, never individual student data
- **Privacy threshold:** If fewer than 5 reflections match a filter, the dashboard returns `insufficientData: true` and hides detailed breakdowns
- **No predictions:** The system does not produce individual failure predictions, risk scores, or mental health assessments
- **Faculty decision-support:** Recommendations are suggestions for instructional adjustment, not automated actions
- **Human in the loop:** All instructional decisions remain with the faculty member
- **Governance page:** Full responsible use statement at `/governance`

---

## MVP Limitations

- Faculty access uses a single shared code (`faculty-demo`) — not multi-user or role-based
- Syllabus parser is heuristic and may miss content in non-standard formats
- No email notifications, no student accounts, no LMS integration
- No longitudinal retention policy UI (data governance deferred to institution)
- Dark mode is available but not the primary design target

## Future Improvements

- Institutional SSO for faculty authentication
- Per-faculty course isolation (multiple courses per institution)
- LMS integration (Canvas, Brightspace) for roster and grade sync prevention
- Improved NLP classifier beyond rule-based heuristics
- Student-facing reflection history (opt-in)
- Automated retention and deletion policy enforcement

---

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Faculty access code is `faculty-demo` (hardcoded in `routes/faculty.ts`)
- Syllabus upload endpoints are **not** in the OpenAPI spec — use plain `fetch()` in the frontend
- `createdAt` from Drizzle is a `Date` object — serialize with `.toISOString()` before sending as JSON
- Express 5: wildcard routes need `/{*splat}`, async handlers must be typed `Promise<void>`
- Never use `console.log` in server code — use `req.log` in route handlers, `logger` elsewhere

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
