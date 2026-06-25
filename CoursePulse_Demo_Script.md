# CoursePulse AI — Full Demo Script
**Emerging Technologies — Summer 2026 | MS in Management & Analytics | NYU SPS**
Team: Angelah Laba · Russel Gramer · Matthew Lukacs · David Petrusev

---

> **How to use this script**
> Keep this on a second screen or print it. The audience only sees the app.
> Each section tells you: what's on the screen, what to click, and exactly what to say.

---

---

## SCREEN 1 — Landing Page `/`

**What's on screen:**
- CoursePulse AI logo and tagline
- Three steps explaining the product flow: Student submits → AI classifies → Faculty adjusts
- Three entry cards: Student Reflection Portal (teal), Faculty Dashboard (violet), Governance Note (gray)
- Footer with privacy statement and NYU branding

**What to click:** Nothing. Let it sit.

**What to say:**

> "This is CoursePulse AI — a responsible AI-powered learning intelligence tool we built for this course. The premise is simple: every week, students submit a short reflection on what clicked and what didn't. The AI classifies those reflections into learning signals. And faculty see only aggregated, class-wide patterns — no individual student data, no grading, no surveillance."

> "Notice these three cards at the bottom of the page. There's a student portal, a faculty dashboard, and a governance page. That governance page matters — it shows the ethical boundaries we designed into the system from the start. We'll look at it later."

> "Let's begin with the student experience."

---

---

## SCREEN 2 — Student Portal Intro `/student`

**What's on screen:**
- CoursePulse logo
- Heading: "Course Reflection"
- Paragraph explaining the purpose
- A card listing five privacy commitments with checkmarks
- One big button: "Submit Your Reflection →"

**What to click:** Click **Enter Student Portal** from the home page.

**What to say:**

> "Before a student even sees the form, they see this. Five explicit privacy commitments, right upfront. Not in a privacy policy link at the bottom of the page — right here, before they type a single word."

> "Not used for grading. Not used for ranking. Not used for failure prediction. Not shown as an individual student profile. These are design constraints, not marketing copy — they're enforced in the system itself."

> "Now let's go to the actual form."

---

---

## SCREEN 3 — Student Reflection Form `/student/submit`

**What's on screen:**
- Back link and a small "Fill Demo Data" button (top right)
- Heading: "Weekly Reflection"
- Dropdown: Select Week
- Dropdown: Select Topic
- Dropdown: Select Learning Objective (populated based on week/topic)
- Confidence slider 1–5 with label "This does not affect your grade"
- Free-text reflection area
- Checkbox: "I'd like additional support or resources on this topic"
- Checkbox: consent / privacy acknowledgment
- Submit button

**What to click:**
1. Click **Fill Demo Data** (top right corner — small dashed button). The form fills automatically.
2. Walk through the filled fields while talking.
3. Click **Submit Reflection** when ready.

**What to say (while pointing to each field):**

> "Here's the reflection form. Let me fill in our demo student — let's call her Maria — with one click."

> *(Click Fill Demo Data)*

> "Maria is in Week 3 — AI Governance and Ethics. She's selected that topic and her learning objective: 'Evaluate responsible AI principles and their application to organizational decision-making.'"

> "Her confidence score is 2 out of 5. Notice what the label says right under the slider: 'This does not affect your grade.' That's there by design — students need to feel safe being honest about confusion."

> "In the free text, Maria writes that she understands responsible AI principles at a conceptual level, but she can't connect them to what a data scientist would actually do differently in practice. She's also flagged that she'd like additional support."

> "Finally, she checks the consent box — which explains exactly how her data is used. Then she clicks Submit."

> *(Click Submit Reflection)*

---

---

## SCREEN 4 — Thank You / Confirmation `/student/thank-you`

**What's on screen:**
- Large green checkmark
- Heading: "Thank you for your reflection."
- A colored badge showing the learning signal that was detected: "Application Gap"
- A plain-language description of what that signal means at the class level
- Fine print: "This signal is aggregated with the rest of the class — your individual response is never shown to your instructor. It is not used for grading, ranking, or any individual evaluation."
- Return Home button

**What to click:** Nothing — this screen loads automatically after submission.

**What to say:**

> "This is the confirmation screen. Maria can see that her reflection was classified as an 'Application Gap' signal. But look at how it's framed: 'Your reflection suggests the class could use more hands-on practice or worked examples to apply this concept.'"

> "It's framed as a class-wide pattern, not Maria's individual result. The language is deliberate — it never says 'you don't understand this.' It says 'the class pattern suggests more practice would help.'"

> "And right below that: her individual response is never shown to the instructor. Not used for grading, ranking, or evaluation. She sees the privacy commitment again at the moment of confirmation."

> "That's the student experience. Now let's switch to the faculty side."

---

---

## SCREEN 5 — Faculty Login `/faculty-login`

**What's on screen:**
- CoursePulse logo
- Card with heading: "Faculty Access"
- Single text field: "Access code"
- Button: "Access Dashboard"
- A small "Fill Demo Data" button (top right of the card)

**What to click:**
1. Click **Enter Faculty Dashboard** from the home page.
2. Click **Fill Demo Data** — it fills the access code automatically.
3. Click **Access Dashboard**.

**What to say:**

> "Faculty log in with an institutional access code. In this MVP it's a shared code — in production this would be replaced by your university's single sign-on system."

> *(Click Fill Demo Data, then Access Dashboard)*

> "Once authenticated, faculty land on the dashboard."

---

---

## SCREEN 6 — Faculty Dashboard `/faculty/dashboard`

**What's on screen:**
- Governance banner at the top: "CoursePulse AI shows aggregated instructional patterns only. It does not grade, rank, predict failure, or evaluate individual students."
- Left sidebar navigation: Dashboard, Course Context, Syllabus Upload, Impact Tracker, Report
- Weekly Learning Pulse: a plain-language summary of what the class needs right now
- Four stat cards: Total Reflections, Average Confidence, Support Request Rate, Top Signal
- Filters: by Week, Topic, Signal type
- Bar chart: Learning Signal Distribution (color-coded by signal type)
- Line chart: Average Confidence by Week
- Topic Breakdown table: each topic with an average severity score and color indicator
- Recommended Actions: specific suggestions based on the data
- Button at bottom: "View Full Course Intelligence Report"

**What to click:** Nothing — scroll slowly through the page while talking.

**What to say:**

> "This is the faculty dashboard. Before anything else — notice the banner at the very top of every faculty page. It's persistent. It can't be dismissed. It reminds the instructor what this tool is and is not."

> *(Scroll to Weekly Pulse)*

> "The Weekly Learning Pulse is a plain-language summary generated from the class data. Right now it's telling the instructor: Application Gap is the dominant signal — students understand the theory but can't apply it. That's the action headline."

> *(Scroll to stat cards)*

> "Four stat cards: 41 total reflections this semester, average confidence across the class, what percentage of students flagged they'd like additional support, and the most common learning signal."

> *(Point to signal distribution chart)*

> "This bar chart shows the full signal distribution — color coded. Green is good: Comprehension and Engagement. Amber is a warning: Application Gap, Transfer Gap, Definitional Confusion. Red is urgent: Support Need. The instructor can see at a glance where attention is needed."

> *(Scroll to line chart)*

> "This is the one I want to highlight. Average confidence by week. Watch the shape of this line. It starts strong in Week 1, dips in Week 2 when we hit Diffusion of Innovation Theory, holds through Week 3 — AI Governance — where it drops to its lowest point. Then it recovers sharply in Week 4."

> "That V-shape is not an accident. It's the feedback loop working. The instructor saw the signals, made an adjustment, and the class responded. We'll see the specific evidence of that in the report."

> *(Scroll to Topic Breakdown table)*

> "The topic breakdown ranks every course topic by average confusion severity — zero to three. Green means the class is tracking. Amber means friction. The instructor can see immediately which topics need revisiting."

> *(Scroll to Recommended Actions)*

> "And finally: recommended instructional adjustments. Specific, actionable suggestions — add a worked example, slow the pacing, offer a review session. These are suggestions, not commands. The instructor decides. Human in the loop, always."

> *(Point to filter bar)*

> "Faculty can also filter by week, topic, or signal type. If I filter for just Week 3 — AI Governance — I see only those reflections. But if a filter returns fewer than 5 reflections, the system blocks the detailed view entirely. That's the privacy threshold — it prevents reverse-identifying any individual student."

---

---

## SCREEN 7 — Course Context `/faculty/course-context`

**What's on screen:**
- Governance banner (persistent on all faculty pages)
- Heading: "Course Context"
- Two setup options: "Manage Manually" (add individual rows) and "Upload Syllabus" (link to upload wizard)
- Table showing the current course context rows: Week, Topic, Learning Objective, Assignment, Reading
- Delete button per row
- Add Row button (opens a dialog)

**What to click:** Click **Course Context** in the left sidebar.

**What to say:**

> "The Course Context page is where the instructor sets up the structure of the course. These are the weeks, topics, and learning objectives that students see in the dropdown on the reflection form."

> "There are two ways to build this: manually row by row, or by uploading a syllabus — which I'll show you in a moment."

> "You can see we have five weeks loaded: Foundations of Emerging Technologies, Diffusion of Innovation Theory, AI Governance and Ethics, back to Diffusion with the applied workshop, and now Human-AI Collaboration and the Future of Work — which is our current week."

> "Each row includes the topic, learning objective, assignment, and readings. This is what populates the student form — it keeps reflections anchored to specific course content instead of being free-floating."

---

---

## SCREEN 8 — Syllabus Upload `/faculty/syllabus-upload`

**What's on screen:**
- Governance banner
- Heading: "Syllabus Upload"
- File upload area: drag and drop or browse (.docx or .txt)
- Instructions explaining the heuristic parser
- After upload: a review table with extracted rows that can be edited or deleted before importing
- "Import to Course Context" button

**What to click:** Click **Syllabus Upload** in the left sidebar.

**What to say:**

> "Instead of setting up the course context manually, an instructor can upload their existing syllabus — a Word document or plain text file — and the system extracts the structure automatically."

> "The parser detects Week headers, topic titles, learning objectives, readings, and assignments from the document format. The extracted rows appear in a review table before anything is saved."

> "The instructor can edit, delete, or add rows. Nothing gets imported until they explicitly click 'Import to Course Context.' The original file is never stored permanently on the server."

> "This is a practical time-saver for the first day of a semester — paste in your syllabus, review the draft, and your course is set up."

---

---

## SCREEN 9 — Impact Tracker `/faculty/impact-tracker`

**What's on screen:**
- Governance banner
- Heading: "Impact Tracker"
- Button: "Log Instructional Adjustment"
- Cards showing previously logged actions, each with: week, topic, what action was taken, and why (the signal that prompted it)

**What to click:** Click **Impact Tracker** in the left sidebar.

**What to say:**

> "The Impact Tracker is where the feedback loop becomes explicit. After the instructor makes an adjustment based on dashboard signals, they log it here — what they did, which week and topic it applied to, and what signal prompted it."

> "You can see three logged actions. Week 2 — Diffusion of Innovation Theory: the Application Gap signal was dominant, so the instructor added a hands-on workshop mapping ChatGPT adoption data to Rogers' framework."

> "Week 3 — AI Governance: Pacing Concern was flagged in four of the eight reflections, and two students explicitly requested support. The instructor reduced scope, added a comparison table as a take-home reference, and opened the next class with a guided Q&A."

> "Week 5 — Human-AI Collaboration: Definitional Confusion and Transfer Gap signals led the instructor to release a glossary card and a presentation rubric."

> "These logged actions feed directly into the report — where we can measure whether they worked."

---

---

## SCREEN 10 — Course Intelligence Report `/faculty/report`

**What's on screen:**
- Governance banner
- Heading: "Course Learning Intelligence Report"
- Badge: "Faculty Decision-Support Tool" + timestamp
- Three summary stat cards: Total Reflections, Avg Confidence, Support Requests
- Confidence Trend section with the weekly line chart and a narrative interpretation paragraph
- Top Signals section: ranked signal types across the whole course
- Evidence of Improvement section: topic-by-topic comparison of before vs. after an instructional adjustment
- Responsible AI disclosure footer

**What to click:** Scroll to bottom of dashboard and click **View Full Course Intelligence Report**, or click **Report** in the sidebar.

**What to say:**

> "The full report brings everything together. It's designed to be a document the instructor can read at the end of a module — or share with a department chair as evidence of responsive teaching."

> *(Point to stat cards)*

> "41 reflections across 5 weeks. Average class confidence is 3.8 out of 5. Support requests across the semester."

> *(Scroll to confidence trend)*

> "The confidence trend with narrative interpretation. The system doesn't just show the chart — it reads it. 'A V-shaped confidence pattern suggests a content-density spike in Week 3 followed by measurable recovery after instructional adjustment.' That's not generated by a language model — it's rule-based interpretation of the actual data."

> *(Scroll to Evidence of Improvement)*

> "This is the section I want to highlight. Evidence of Improvement. For each topic where the instructor logged an adjustment, the report shows the before and after."

> "Diffusion of Innovation Theory: before the Week 2 case study workshop, Application Gap was the dominant signal across six of the seven reflections. After the workshop in Week 4, the class returned to the same topic with 11 reflections — and the dominant signals shifted to Comprehension and Engagement Signal. The gap nearly disappeared."

> "That's the measurement the system provides: not 'which students improved,' but 'did the instructional adjustment move the class-wide signal?' That's a fundamentally different — and we think more ethical — use of AI in education."

> *(Scroll to footer)*

> "And at the bottom of every report: a responsible AI disclosure. This report contains only aggregated data. No individual student profiles. No risk scores. No predictions. For instructional improvement only."

---

---

## SCREEN 11 — Governance Page `/governance`

**What's on screen:**
- Heading: "Responsible Use Statement"
- Sections: Purpose, What the system does, What the system does NOT do (bulleted list), Data minimization, Regulatory compliance posture (FERPA, GDPR, NIST AI RMF), Human oversight, Classroom use boundaries
- A pull-quote block with the full responsible use statement

**What to click:** Click **View Governance Note** from the home page, or navigate directly.

**What to say:**

> "Finally — the governance page. Every product that touches student data should have one of these. Ours is written in plain language, not legalese."

> *(Scroll through sections slowly)*

> "It covers what the system does — classify reflections, surface class-wide patterns, support instructional decisions. And what it explicitly does not do — no grading, no ranking, no failure prediction, no individual surveillance, no mental health diagnosis, no automated disciplinary actions."

> "The data minimization section explains the privacy threshold: detailed views are blocked if fewer than five reflections match a filter. That's a technical constraint that prevents reverse-identification of individual students, not just a policy statement."

> "The regulatory section references FERPA, GDPR, and the NIST AI Risk Management Framework — the frameworks that govern AI use in educational settings. We designed around these from the beginning, not as an afterthought."

> *(Scroll to the pull-quote block)*

> "And this is the responsible use statement — the one-paragraph version of what this tool is and isn't. We think every AI tool in education should have something like this. Not hidden in a terms of service. Right here, findable, readable."

---

---

## Closing

**What to say:**

> "CoursePulse AI answers a specific question: how do you build an AI tool for education that is actually useful to faculty without becoming a surveillance instrument for students?"

> "Our answer: aggregate everything, surface nothing individual, make the privacy commitments visible to both sides, and keep the human — the instructor — in every decision loop."

> "The system measures learning patterns, not students. It supports teaching decisions, not evaluations. And it makes those boundaries explicit in the code, not just in the documentation."

> "Thank you."

---

---

## Quick Reference Card

| Screen | URL | Key Action |
|---|---|---|
| Landing | `/` | Let it sit — read Step 1 intro |
| Student Intro | `/student` | Point to the 5 privacy commitments |
| Reflection Form | `/student/submit` | Click **Fill Demo Data** → Submit |
| Thank You | `/student/thank-you` | Auto-loads — point to signal framing |
| Faculty Login | `/faculty-login` | Click **Fill Demo Data** → Access Dashboard |
| Dashboard | `/faculty/dashboard` | Scroll: Pulse → stats → charts → recommendations |
| Course Context | `/faculty/course-context` | Show the 5-week table |
| Syllabus Upload | `/faculty/syllabus-upload` | Explain the upload workflow (no need to upload live) |
| Impact Tracker | `/faculty/impact-tracker` | Show 3 logged actions |
| Report | `/faculty/report` | Scroll to Evidence of Improvement |
| Governance | `/governance` | Scroll to "What the system does NOT do" |

---

## If Something Goes Wrong

| Problem | Fix |
|---|---|
| Dashboard shows no data | Make sure you're logged in — navigate to `/faculty-login`, Fill Demo Data, submit |
| "Insufficient data" message on dashboard | Clear all three filter dropdowns (Week, Topic, Signal) |
| Student form dropdowns are empty | Course context may not be loaded — check `/faculty/course-context` |
| Faculty login fails | Access code is **faculty-demo** |
| Thank-you page shows no signal | Submit the form first — don't navigate to it directly |
