# Known Limitations

CoursePulse AI is a course MVP and should not be treated as a production-ready institutional system without further review.

## Technical limitations

1. **Classifier is rule-based in the current repository.** The MVP uses keyword and confidence-score heuristics in `artifacts/api-server/src/lib/classifier.ts`. This is useful for a controlled prototype but should be validated against a human-coded benchmark before live use.

2. **No production authentication.** Faculty access uses the shared demo access code `faculty-demo`. A production version would require SSO, role-based access control, course-level permissions, and audit logging.

3. **No student accounts or identity layer.** This supports the privacy-preserving MVP concept, but it also means the system does not support personalized reflection history or authenticated student workflows.

4. **PostgreSQL schema has no formal retention policy implementation.** The MVP stores reflections and classified signals but does not yet implement automated deletion, retention windows, data export, or student data-rights workflows.

5. **Syllabus parsing depends on an external AI integration.** The syllabus upload route requires Anthropic integration variables and may fail if those are not available. The parser also depends on syllabus formatting quality.

6. **OpenAPI coverage is incomplete.** The Replit notes indicate that some syllabus-upload endpoints use direct `fetch()` rather than the generated OpenAPI client path.

7. **No LMS integration.** Canvas, Brightspace, Blackboard, roster sync, and gradebook integration are not implemented and should not be added without governance review.

## Data and model limitations

1. **Synthetic data only.** The demo seed data and CSV samples are simulated and do not prove performance on real student reflections.

2. **No final measured accuracy.** The current handoff includes proposed testing criteria, but live accuracy, sample size, time-to-insight results, and actionability rate still need to be measured.

3. **Potential misclassification.** Keyword matching may confuse definitional confusion, transfer gaps, and application gaps when student language is ambiguous.

4. **Bias and language variation not yet validated.** The classifier should be tested against diverse writing styles, dialects, multilingual students, and short/unclear responses.

## Governance limitations

1. **Not approved for live student records.** Any use with live student data would require institutional privacy, FERPA, legal, security, and data-governance review.

2. **Not a grading or risk system.** CoursePulse AI must not be used to grade, rank, discipline, predict failure, identify at-risk students, diagnose mental health, or evaluate individual students.

3. **Faculty judgment required.** Recommendations are advisory and should be reviewed by faculty before any instructional action.

4. **Aggregation thresholds need review.** The dashboard includes a privacy threshold for filtered views, but the threshold should be reviewed institutionally before production deployment.
