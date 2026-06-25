# CoursePulse AI — Demo Script
**Emerging Technologies — Summer 2026 | MS in Management & Analytics | NYU SPS**
Team: Angelah Laba · Russel Gramer · Matthew Lukacs · David Petrusev

---

## Before You Start
- Open the app at the preview URL
- Make sure the seed data is loaded (26 reflections, 4 course context rows)
- Faculty access code: **faculty-demo**
- Keep this document on a second screen or printed

---

## STEP 1 — Landing Page `/`

**What to click:** Nothing. Just let the page sit.

**What to say:**

> "This is CoursePulse AI — a responsible learning intelligence tool we built for this course. The core idea is simple: students submit a short weekly reflection on what clicked and what didn't. Faculty see only aggregated, class-wide patterns. No individual student data is ever shown. No grading, no ranking, no surveillance. Let me walk you through the full flow."

---

## STEP 2 — Student Reflection Form `/student`→`/student/submit`

**What to click:**
1. Click **Enter Student Portal**
2. Click **Submit a Reflection**
3. Click **"Fill Demo Data"** *(small dashed button at the top of the form — fills everything automatically)*
4. Point out the filled form to the audience, then click **Submit Reflection**

**What to say (while the form fills):**

> "Here's the student view. A student — let's call her Maria — is in Week 3 of the course. She's studying AI Governance and Ethics. She rates her confidence a 2 out of 5. In her reflection, she writes that she understands the principles conceptually but can't connect them to what a data scientist would actually do differently. She also flags that she'd like additional support."

> "Notice two things: the confidence rating clearly says 'This does not affect your grade.' And before submitting, Maria checks a consent box that explains exactly how her data is used — anonymized, aggregated, never for evaluation."

---

## STEP 3 — Thank You / Confirmation `/student/thank-you`

**What to click:** Nothing — page loads automatically after submission.

**What to say:**

> "Maria gets this confirmation screen. She can see that her reflection was classified as an 'Application Gap' signal — but it's framed as a class-wide pattern, not her personal profile. The system explicitly tells her: this is not used for grading, ranking, failure prediction, or surveillance. That transparency is intentional."

---

## STEP 4 — Faculty Login `/faculty-login`

**What to click:**
1. Click **Enter Faculty Dashboard** from the landing page (or navigate manually)
2. Click **"Fill Demo Data"** *(fills the access code automatically)*
3. Click **Access Dashboard**

**What to say:**

> "Now let's switch to the faculty view. In this MVP, faculty log in with a shared access code — a placeholder for what would be institutional SSO in production. Once they're in, everything they see is aggregated."

---

## STEP 5 — Faculty Dashboard `/faculty/dashboard`

**What to click:** Nothing — just scroll through the page. Point out sections as you talk.

**What to say:**

> "This is the faculty dashboard. At the top: the Weekly Learning Pulse — a plain-language summary of what the class is experiencing this period and what the instructor should prioritize."

> "Below that: four stat cards. Total reflections, average confidence, support request rate, and the most common learning signal. Right now, Application Gap is the dominant signal — students understand the theory but can't apply it."

> "The bar chart shows the signal distribution with color coding: green for comprehension and engagement, amber for gaps, red for support needs. The line chart shows average confidence by week — you can see a V-shape pattern, where confidence dipped in Week 3 before recovering in Week 4 after the instructional adjustment."

> "The topic breakdown table shows each topic ranked by confusion severity on a 0 to 3 scale. And below that, the system generates specific recommended instructional adjustments — for example, 'add a hands-on exercise or worked example for AI Governance.'"

> "Critically: at no point does the faculty member see any individual student's data. The privacy threshold is set at 5 reflections minimum — if a filter returns fewer, the detailed view is blocked entirely."

---

## STEP 6 — Faculty Report `/faculty/report`

**What to click:**
1. Scroll to the bottom of the dashboard
2. Click **View Course Learning Intelligence Report**

**What to say:**

> "The full report pulls everything together. Here you can see the course-wide confidence trend with narrative interpretation — in this case, the V-shape pattern suggests a content-density spike in Week 3 followed by recovery after the faculty adjusted their approach."

> "The section I want to highlight is Evidence of Improvement. Before the instructional adjustment in Week 3, Application Gap signals made up 85.7% of reflections on the Diffusion of Innovation topic. After the adjustment — which was adding a real-world case study — that dropped to 16.7%. A 69-point reduction. That's the feedback loop this system creates: signal, action, measurement."

> "The report also includes a responsible AI disclosure at the bottom: this report contains only aggregated data, no individual student profiles, no risk scores, no predictions."

---

## STEP 7 — Governance Page `/governance` *(optional if time allows)*

**What to click:** Navigate to `/governance` from the main menu.

**What to say:**

> "Finally, the governance page. This documents the responsible use commitments built into the system — what the tool does, what it deliberately does not do, and the ethical constraints we designed around. We believe AI tools in education need to make these commitments explicit and accessible, not buried in a privacy policy."

---

## Closing

**What to say:**

> "CoursePulse AI is a faculty decision-support tool, not a student evaluation tool. It's designed to shift the question from 'which students are failing?' to 'where is the whole class getting stuck?' That's a fundamentally different way to use AI in the classroom — and we think it's the responsible one."

> "Thank you."

---

## Quick Reference

| Page | URL | Key Action |
|---|---|---|
| Landing | `/` | Show NYU footer, feature cards |
| Student form | `/student/submit` | Click **Fill Demo Data**, then Submit |
| Thank you | `/student/thank-you` | Auto-loads after submit |
| Faculty login | `/faculty-login` | Click **Fill Demo Data**, then Access Dashboard |
| Dashboard | `/faculty/dashboard` | Scroll through — signal chart, trend, recommendations |
| Report | `/faculty/report` | Highlight V-shape trend + Evidence of Improvement |
| Governance | `/governance` | Optional |

## If Something Goes Wrong

- **Blank dashboard / no data:** Run the seed script — `pnpm --filter @workspace/scripts run seed` (truncate DB first)
- **Faculty login fails:** Access code is `faculty-demo`
- **Form won't submit:** Make sure Week and Topic dropdowns are selected (Fill Demo Data handles this)
- **Privacy gate shows:** Clear the topic/week/signal filters on the dashboard
