# Testing Notes

## Current test basis

The MVP uses simulated reflections rather than live student records. The seed script at `scripts/src/seed.ts` inserts course context, reflections, classified signals, and faculty actions for demonstration and testing.

## What the current demo validates

- Student reflection submission flow.
- Server-side classification and storage of learning signals.
- Faculty dashboard aggregation.
- Confidence trends and signal distribution visuals.
- Course-context management.
- Faculty action tracking.
- Governance statement and responsible-use boundaries.

## Proposed success criteria

| Criterion | Target |
|---|---:|
| Classification agreement | At least 80% agreement with a human-coded benchmark dataset. |
| Privacy-preserving output | No student names, rankings, individual risk scores, or failure predictions. |
| Time to insight | Faculty can identify top class-wide friction points in under 5 minutes. |
| Actionability | More than 60% of recommendations are accepted or modified by faculty reviewer. |
| End-to-end workflow | Reflection submission through dashboard update and governance disclosure functions. |

## Recommended validation method

1. Create a benchmark dataset of simulated reflections mapped to course topics and learning objectives.
2. Have at least two human reviewers independently code primary and secondary signals.
3. Resolve human-label disagreements into a benchmark label set.
4. Run the classifier against the benchmark set.
5. Calculate agreement by primary signal, secondary signal, and severity score.
6. Review misclassified cases, especially definitional confusion versus application gap and application gap versus transfer gap.
7. Test dashboard usability with a faculty reviewer and record time to identify top class-wide issues.

## Current limitation

This package does not include final measured accuracy, final sample size, or a completed human-coded benchmark result. Those should be added before claiming production readiness.
