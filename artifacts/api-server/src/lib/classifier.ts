export interface ClassificationResult {
  primarySignal: string;
  secondarySignal: string | null;
  severityScore: number;
  themeSummary: string;
  recommendedAction: string;
}

const SIGNALS = {
  COMPREHENSION: "Comprehension",
  DEFINITIONAL_CONFUSION: "Definitional Confusion",
  APPLICATION_GAP: "Application Gap",
  TRANSFER_GAP: "Transfer Gap",
  PACING_CONCERN: "Pacing Concern",
  SUPPORT_NEED: "Support Need",
  ENGAGEMENT: "Engagement Signal",
};

interface SignalRule {
  signal: string;
  keywords: string[];
  severity: number;
}

const rules: SignalRule[] = [
  {
    signal: SIGNALS.SUPPORT_NEED,
    keywords: ["help", "lost", "overwhelmed", "struggling", "confused", "don't understand", "do not understand", "need support", "need help", "stuck", "falling behind", "can't keep up", "cannot keep up"],
    severity: 3,
  },
  {
    signal: SIGNALS.PACING_CONCERN,
    keywords: ["too fast", "too much", "rushed", "pace", "pacing", "slow down", "not enough time", "ran out of time", "moving quickly", "too quickly", "covered a lot"],
    severity: 2,
  },
  {
    signal: SIGNALS.TRANSFER_GAP,
    keywords: ["can't apply", "cannot apply", "don't know how to use", "not sure how to use", "connect to", "can't connect", "in practice", "real world", "real-world", "how does this relate", "how does this apply", "can't see how", "link between", "bridge"],
    severity: 2,
  },
  {
    signal: SIGNALS.APPLICATION_GAP,
    keywords: ["example", "examples", "how to use", "not sure how", "don't know how", "practice", "exercise", "apply", "application", "use this in", "concrete", "hands-on"],
    severity: 2,
  },
  {
    signal: SIGNALS.DEFINITIONAL_CONFUSION,
    keywords: ["what is", "definition", "define", "not sure what", "unclear what", "meaning of", "means", "confused about the term", "what does", "terminology", "terms", "jargon"],
    severity: 1,
  },
  {
    signal: SIGNALS.COMPREHENSION,
    keywords: ["understand", "understood", "clear", "makes sense", "got it", "learned", "grasp", "following", "follow along", "comprehend"],
    severity: 0,
  },
  {
    signal: SIGNALS.ENGAGEMENT,
    keywords: ["interesting", "excited", "curious", "enjoy", "enjoyed", "fascinating", "love", "loved", "engage", "motivated", "inspired", "relevant", "useful", "important"],
    severity: 0,
  },
];

function scoreText(text: string, rule: SignalRule): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const keyword of rule.keywords) {
    if (lower.includes(keyword)) {
      score++;
    }
  }
  return score;
}

function getSummary(signal: string, topic: string): string {
  switch (signal) {
    case SIGNALS.SUPPORT_NEED:
      return `Student is experiencing significant difficulty with ${topic} and has requested or implied a need for additional instructional support.`;
    case SIGNALS.PACING_CONCERN:
      return `Student finds the pacing of ${topic} content too fast or the volume too high to process effectively.`;
    case SIGNALS.TRANSFER_GAP:
      return `Student understands the basic concept of ${topic} but struggles to connect it to other frameworks or real-world contexts.`;
    case SIGNALS.APPLICATION_GAP:
      return `Student understands ${topic} theoretically but is uncertain how to apply or practice the concept concretely.`;
    case SIGNALS.DEFINITIONAL_CONFUSION:
      return `Student has difficulty with key terminology or definitions related to ${topic}.`;
    case SIGNALS.COMPREHENSION:
      return `Student demonstrates positive comprehension and engagement with ${topic} content.`;
    case SIGNALS.ENGAGEMENT:
      return `Student shows curiosity, motivation, or enthusiasm about ${topic}.`;
    default:
      return `Student submitted a reflection on ${topic}.`;
  }
}

function getRecommendedAction(signal: string): string {
  switch (signal) {
    case SIGNALS.SUPPORT_NEED:
      return "Reach out proactively with office hours or an additional support session. Consider offering a brief check-in with struggling students.";
    case SIGNALS.PACING_CONCERN:
      return "Consider slowing the pace for the next session, adding a review activity, or breaking concepts into smaller segments.";
    case SIGNALS.TRANSFER_GAP:
      return "Provide a worked example connecting the topic to a current technology or real-world case. Use analogies to bridge concepts.";
    case SIGNALS.APPLICATION_GAP:
      return "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.";
    case SIGNALS.DEFINITIONAL_CONFUSION:
      return "Review key terms at the start of the next session. Consider a brief vocabulary activity or a one-page glossary.";
    case SIGNALS.COMPREHENSION:
      return "Continue current instructional approach. Consider increasing challenge or extending application opportunities.";
    case SIGNALS.ENGAGEMENT:
      return "Capitalize on engagement by connecting upcoming topics to students' expressed interests and curiosity.";
    default:
      return "Review reflections holistically and consider adjusting instruction based on patterns.";
  }
}

export function classifyReflection(
  reflectionText: string,
  topic: string,
  confidenceScore: number
): ClassificationResult {
  const scores: Array<{ signal: string; score: number; severity: number }> = rules.map((rule) => ({
    signal: rule.signal,
    score: scoreText(reflectionText, rule),
    severity: rule.severity,
  }));

  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.severity - a.severity;
  });

  let primary = scores[0];
  let secondary = scores[1]?.score > 0 ? scores[1] : null;

  if (primary.score === 0) {
    if (confidenceScore <= 2) {
      primary = { signal: SIGNALS.SUPPORT_NEED, score: 0, severity: 3 };
      secondary = { signal: SIGNALS.PACING_CONCERN, score: 0, severity: 2 };
    } else if (confidenceScore === 3) {
      primary = { signal: SIGNALS.APPLICATION_GAP, score: 0, severity: 2 };
      secondary = null;
    } else {
      primary = { signal: SIGNALS.COMPREHENSION, score: 0, severity: 0 };
      secondary = null;
    }
  }

  let severityScore = primary.severity;
  if (confidenceScore <= 2 && severityScore < 2) {
    severityScore = 2;
  } else if (confidenceScore >= 4 && severityScore > 1) {
    severityScore = Math.max(0, severityScore - 1);
  }

  return {
    primarySignal: primary.signal,
    secondarySignal: secondary?.signal ?? null,
    severityScore,
    themeSummary: getSummary(primary.signal, topic),
    recommendedAction: getRecommendedAction(primary.signal),
  };
}
