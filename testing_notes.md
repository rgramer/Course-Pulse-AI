# Governance Note

CoursePulse AI is designed as a faculty decision-support tool for class-wide instructional improvement.

## Intended use

CoursePulse AI may be used to identify aggregated learning-signal patterns from low-stakes reflections, such as application gaps, definitional confusion, pacing concerns, support needs, transfer gaps, and engagement signals. Faculty can use those patterns to adjust pacing, clarify confusing topics, add examples, provide supplemental resources, or redesign practice activities.

## Prohibited uses

CoursePulse AI must not be used to:

- grade student reflections;
- rank students;
- predict failure;
- create individual risk scores;
- label students as at-risk;
- diagnose mental health or behavioral conditions;
- trigger disciplinary action;
- evaluate individual student performance;
- replace faculty judgment.

## Data minimization

The MVP is designed around minimal reflection data: course week, topic, learning objective, confidence score, support-request flag, and reflection text. The current demo does not require student names or student IDs.

## Aggregation and privacy threshold

Faculty views should show aggregated, class-wide learning patterns. The current dashboard includes an insufficient-data guardrail for small filtered views. Before production deployment, the privacy threshold should be reviewed by institutional privacy/legal stakeholders.

## Human oversight

All recommendations are advisory. Faculty remain responsible for interpreting the dashboard and deciding whether an instructional adjustment is appropriate.

## Production approval requirement

Any deployment with live students would require FERPA-aware institutional review, legal/privacy review, security review, hosting approval, retention rules, access-control design, and a clear student disclosure process.
