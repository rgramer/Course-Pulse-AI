# Classification Logic

The current repository implements classification in `artifacts/api-server/src/lib/classifier.ts`.

## Current MVP approach

The classifier is rule-based. It compares each reflection against keyword rules for approved learning-signal categories and adjusts severity based on the student's confidence score.

## Learning signals

| Signal | Meaning |
|---|---|
| Comprehension | Student indicates that the content is clear or understood. |
| Definitional Confusion | Student is unclear on terminology, definitions, or core concept meaning. |
| Application Gap | Student understands the concept in theory but is unsure how to apply or practice it. |
| Transfer Gap | Student struggles to connect the concept to another framework, prior knowledge, or real-world case. |
| Pacing Concern | Student indicates that the material is moving too fast, too slowly, or with too much volume. |
| Support Need | Student asks for help or indicates significant difficulty. |
| Engagement Signal | Student expresses interest, curiosity, motivation, or enthusiasm. |

## Processing flow

1. Receive reflection text, topic, learning objective, confidence score, and support-request flag.
2. Score the text against keyword rules for each signal.
3. Select the highest-scoring signal as the primary signal.
4. Select a secondary signal when another category also has keyword support.
5. If no keywords match, use confidence score as a fallback:
   - confidence 1–2: support/pacing concern;
   - confidence 3: application gap;
   - confidence 4–5: comprehension.
6. Adjust severity based on confidence score.
7. Return primary signal, secondary signal, severity score, theme summary, and recommended instructional action.

## Governance constraints

The classifier returns instructional signals, not student judgments. It does not return grades, ranks, failure predictions, risk scores, mental-health labels, or disciplinary recommendations.

## Recommended next step

Before live deployment, benchmark the classifier against a human-coded validation set and consider replacing or supplementing the rule-based classifier with a governed LLM classifier that uses the same taxonomy and output schema.
