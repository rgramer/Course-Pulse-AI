import { Router, type IRouter } from "express";
import { db, reflectionsTable, classifiedSignalsTable, facultyActionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  VerifyFacultyAccessBody,
  ListFacultyActionsResponse,
  CreateFacultyActionBody,
} from "@workspace/api-zod";
import { requireFacultyAuth } from "../middleware/facultyAuth";

const FACULTY_ACCESS_CODE = "faculty-demo";
const PRIVACY_MIN = 5;

const router: IRouter = Router();

router.post("/faculty/verify", async (req, res): Promise<void> => {
  const parsed = VerifyFacultyAccessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.accessCode !== FACULTY_ACCESS_CODE) {
    res.status(401).json({ error: "Invalid access code" });
    return;
  }
  res.cookie("cp_faculty", "1", {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ success: true });
});

router.post("/faculty/logout", (_req, res): void => {
  res.clearCookie("cp_faculty");
  res.json({ success: true });
});

router.get("/faculty/dashboard", requireFacultyAuth, async (req, res): Promise<void> => {
  const weekParam = req.query.week ? parseInt(req.query.week as string, 10) : null;
  const topicParam = req.query.topic ? (req.query.topic as string) : null;
  const signalParam = req.query.signal ? (req.query.signal as string) : null;

  let allReflections = await db.select().from(reflectionsTable);
  let allSignals = await db.select().from(classifiedSignalsTable);
  const allActions = await db.select().from(facultyActionsTable);

  if (weekParam !== null) {
    allReflections = allReflections.filter((r) => r.week === weekParam);
  }
  if (topicParam) {
    allReflections = allReflections.filter((r) => r.topic === topicParam);
  }

  const reflectionIds = new Set(allReflections.map((r) => r.id));
  allSignals = allSignals.filter((s) => reflectionIds.has(s.reflectionId));

  if (signalParam) {
    allSignals = allSignals.filter((s) => s.primarySignal === signalParam);
    const signalReflectionIds = new Set(allSignals.map((s) => s.reflectionId));
    allReflections = allReflections.filter((r) => signalReflectionIds.has(r.id));
  }

  const totalReflections = allReflections.length;
  const isFiltered = weekParam !== null || topicParam !== null || signalParam !== null;
  const insufficientData = isFiltered && totalReflections < PRIVACY_MIN;

  if (insufficientData) {
    res.json({
      totalReflections: 0,
      avgConfidenceScore: 0,
      mostCommonSignal: "Insufficient data",
      highestConcernTopic: null,
      percentRequestingSupport: 0,
      avgSeverity: 0,
      totalInstructionalActions: allActions.length,
      signalDistribution: [],
      topicConfusion: [],
      confidenceTrend: [],
      topConfusionThemes: [],
      recommendedAdjustments: [],
      weeklyPulse: {
        avgConfidence: 0,
        mostCommonSignal: "Insufficient data",
        highestConcernTopic: null,
        facultyPriority: "Not enough reflections to generate a priority.",
        insufficientData: true,
      },
      insufficientData: true,
    });
    return;
  }

  const avgConfidenceScore =
    totalReflections > 0
      ? allReflections.reduce((sum, r) => sum + r.confidenceScore, 0) / totalReflections
      : 0;

  const supportCount = allReflections.filter((r) => r.supportRequested).length;
  const percentRequestingSupport =
    totalReflections > 0 ? (supportCount / totalReflections) * 100 : 0;

  const avgSeverity =
    allSignals.length > 0
      ? allSignals.reduce((sum, s) => sum + s.severityScore, 0) / allSignals.length
      : 0;

  const signalCountMap: Record<string, number> = {};
  for (const s of allSignals) {
    signalCountMap[s.primarySignal] = (signalCountMap[s.primarySignal] ?? 0) + 1;
  }
  const signalDistribution = Object.entries(signalCountMap)
    .map(([signal, count]) => ({ signal, count }))
    .sort((a, b) => b.count - a.count);

  const mostCommonSignal = signalDistribution[0]?.signal ?? "No data";

  const topicMap: Record<
    string,
    {
      totalSeverity: number;
      count: number;
      signalCounts: Record<string, number>;
      learningObjective: string;
    }
  > = {};
  for (const sig of allSignals) {
    const ref = allReflections.find((r) => r.id === sig.reflectionId);
    if (!ref) continue;
    const topic = ref.topic;
    if (!topicMap[topic]) {
      topicMap[topic] = { totalSeverity: 0, count: 0, signalCounts: {}, learningObjective: ref.learningObjective };
    }
    topicMap[topic].totalSeverity += sig.severityScore;
    topicMap[topic].count++;
    topicMap[topic].signalCounts[sig.primarySignal] =
      (topicMap[topic].signalCounts[sig.primarySignal] ?? 0) + 1;
  }

  const topicConfusion = Object.entries(topicMap)
    .filter(([, data]) => data.count >= PRIVACY_MIN)
    .map(([topic, data]) => {
      const avgSev = data.count > 0 ? data.totalSeverity / data.count : 0;
      const mostCommon =
        Object.entries(data.signalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";
      return { topic, avgSeverity: avgSev, count: data.count, mostCommonSignal: mostCommon };
    })
    .sort((a, b) => b.avgSeverity - a.avgSeverity);

  const highestConcernTopic = topicConfusion[0]?.topic ?? null;

  const weekMap: Record<number, { totalConfidence: number; count: number }> = {};
  for (const r of allReflections) {
    if (!weekMap[r.week]) weekMap[r.week] = { totalConfidence: 0, count: 0 };
    weekMap[r.week].totalConfidence += r.confidenceScore;
    weekMap[r.week].count++;
  }
  const confidenceTrend = Object.entries(weekMap)
    .filter(([, data]) => data.count >= PRIVACY_MIN)
    .map(([week, data]) => ({
      week: parseInt(week, 10),
      avgConfidence: data.count > 0 ? data.totalConfidence / data.count : 0,
    }))
    .sort((a, b) => a.week - b.week);

  const topConfusionThemes = topicConfusion
    .filter((t) => t.avgSeverity >= 1.5)
    .slice(0, 5)
    .map((t) => {
      const lo = topicMap[t.topic]?.learningObjective ?? "";
      return buildThemeSummary(t.topic, t.mostCommonSignal, lo);
    });

  const recommendedAdjustments: Array<{
    pattern: string;
    action: string;
    rationale: string;
    topic: string;
    learningObjective: string;
  }> = [];

  for (const topic of topicConfusion.slice(0, 4)) {
    const lo = topicMap[topic.topic]?.learningObjective ?? "";
    if (topic.avgSeverity >= 2) {
      recommendedAdjustments.push({
        pattern: `High ${topic.mostCommonSignal} detected across ${topic.count} reflections for "${topic.topic}".`,
        action: getActionForSignal(topic.mostCommonSignal),
        rationale: getRationaleForSignal(topic.mostCommonSignal, topic.topic),
        topic: topic.topic,
        learningObjective: lo,
      });
    } else if (topic.avgSeverity >= 1) {
      recommendedAdjustments.push({
        pattern: `Moderate ${topic.mostCommonSignal} noted for "${topic.topic}" across ${topic.count} reflections.`,
        action: `Consider adding a supplemental example or brief review activity for "${topic.topic}".`,
        rationale: `Students are partially following the material but need additional reinforcement to solidify understanding.`,
        topic: topic.topic,
        learningObjective: lo,
      });
    }
  }

  if (percentRequestingSupport >= 20) {
    recommendedAdjustments.push({
      pattern: `${Math.round(percentRequestingSupport)}% of students requested support.`,
      action: "Hold an open office hours session or brief a check-in activity at the start of next class.",
      rationale:
        "A substantial share of the class has signaled that they need additional guidance beyond lecture content.",
      topic: highestConcernTopic ?? "General",
      learningObjective: "Student support and access",
    });
  }
  if (avgConfidenceScore < 2.5 && totalReflections > 0) {
    recommendedAdjustments.push({
      pattern: `Class-wide average confidence is ${avgConfidenceScore.toFixed(1)} out of 5.`,
      action: "Schedule a mid-week review or recap session before advancing to new material.",
      rationale:
        "Low class-wide confidence suggests the current content load may be outpacing comprehension.",
      topic: highestConcernTopic ?? "General",
      learningObjective: "Course pacing and comprehension",
    });
  }

  const facultyPriority = buildFacultyPriority(
    highestConcernTopic,
    mostCommonSignal,
    avgConfidenceScore,
    percentRequestingSupport
  );

  res.json({
    totalReflections,
    avgConfidenceScore: parseFloat(avgConfidenceScore.toFixed(2)),
    mostCommonSignal,
    highestConcernTopic,
    percentRequestingSupport: parseFloat(percentRequestingSupport.toFixed(1)),
    avgSeverity: parseFloat(avgSeverity.toFixed(2)),
    totalInstructionalActions: allActions.length,
    signalDistribution,
    topicConfusion,
    confidenceTrend,
    topConfusionThemes,
    recommendedAdjustments,
    weeklyPulse: {
      avgConfidence: parseFloat(avgConfidenceScore.toFixed(2)),
      mostCommonSignal,
      highestConcernTopic,
      facultyPriority,
      insufficientData: false,
    },
    insufficientData: false,
  });
});

router.get("/faculty/actions", requireFacultyAuth, async (_req, res): Promise<void> => {
  const rows = await db.select().from(facultyActionsTable).orderBy(facultyActionsTable.week);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/faculty/actions", requireFacultyAuth, async (req, res): Promise<void> => {
  const parsed = CreateFacultyActionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(facultyActionsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/faculty/report", requireFacultyAuth, async (_req, res): Promise<void> => {
  const reflections = await db.select().from(reflectionsTable);
  const signals = await db.select().from(classifiedSignalsTable);
  const actions = await db.select().from(facultyActionsTable);

  const totalReflections = reflections.length;
  const avgConfidence =
    totalReflections > 0
      ? reflections.reduce((sum, r) => sum + r.confidenceScore, 0) / totalReflections
      : 0;
  const supportRate =
    totalReflections > 0
      ? (reflections.filter((r) => r.supportRequested).length / totalReflections) * 100
      : 0;

  const topicMap: Record<
    string,
    { totalSeverity: number; count: number; signalCounts: Record<string, number>; engagementCount: number }
  > = {};
  for (const sig of signals) {
    const ref = reflections.find((r) => r.id === sig.reflectionId);
    if (!ref) continue;
    const topic = ref.topic;
    if (!topicMap[topic]) {
      topicMap[topic] = { totalSeverity: 0, count: 0, signalCounts: {}, engagementCount: 0 };
    }
    topicMap[topic].totalSeverity += sig.severityScore;
    topicMap[topic].count++;
    topicMap[topic].signalCounts[sig.primarySignal] =
      (topicMap[topic].signalCounts[sig.primarySignal] ?? 0) + 1;
    if (sig.primarySignal === "Engagement Signal" || sig.primarySignal === "Comprehension") {
      topicMap[topic].engagementCount++;
    }
  }

  const topicSummaries = Object.entries(topicMap)
    .filter(([, data]) => data.count >= PRIVACY_MIN)
    .map(([topic, data]) => {
      const avgSev = data.count > 0 ? data.totalSeverity / data.count : 0;
      const dominantSignal =
        Object.entries(data.signalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";
      const engRatio = data.count > 0 ? data.engagementCount / data.count : 0;
      return {
        topic,
        avgSeverity: parseFloat(avgSev.toFixed(2)),
        count: data.count,
        dominantSignal,
        engagementLevel: engRatio >= 0.5 ? "High" : engRatio >= 0.25 ? "Moderate" : "Low",
      };
    });

  const mostConfusingTopics = [...topicSummaries].sort((a, b) => b.avgSeverity - a.avgSeverity).slice(0, 5);
  const highestEngagementTopics = [...topicSummaries]
    .filter((t) => t.engagementLevel !== "Low")
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const weekMap: Record<number, number[]> = {};
  for (const r of reflections) {
    if (!weekMap[r.week]) weekMap[r.week] = [];
    weekMap[r.week].push(r.confidenceScore);
  }
  const weekTrends = Object.entries(weekMap)
    .filter(([, scores]) => scores.length >= PRIVACY_MIN)
    .map(([w, scores]) => ({ week: parseInt(w, 10), avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
    .sort((a, b) => a.week - b.week);
  const firstWeekAvg = weekTrends[0]?.avg ?? avgConfidence;
  const lastWeekAvg = weekTrends[weekTrends.length - 1]?.avg ?? avgConfidence;
  const trendDelta = lastWeekAvg - firstWeekAvg;
  const firstWeek = weekTrends[0]?.week ?? 1;
  const lastWeek = weekTrends[weekTrends.length - 1]?.week ?? 10;
  const minEntry = weekTrends.reduce((m, w) => (w.avg < m.avg ? w : m), weekTrends[0] ?? { avg: avgConfidence, week: 1 });
  const maxEntry = weekTrends.reduce((m, w) => (w.avg > m.avg ? w : m), weekTrends[0] ?? { avg: avgConfidence, week: 1 });
  const isVShape =
    weekTrends.length >= 3 &&
    minEntry.week !== firstWeek &&
    minEntry.week !== lastWeek &&
    firstWeekAvg - minEntry.avg >= 0.5 &&
    lastWeekAvg - minEntry.avg >= 0.5;
  const isInvertedV =
    weekTrends.length >= 3 &&
    maxEntry.week !== firstWeek &&
    maxEntry.week !== lastWeek &&
    maxEntry.avg - firstWeekAvg >= 0.5 &&
    maxEntry.avg - lastWeekAvg >= 0.5;
  const confidenceTrendSummary =
    isVShape
      ? `Confidence dipped to ${minEntry.avg.toFixed(1)} in Week ${minEntry.week} before recovering to ${lastWeekAvg.toFixed(1)} in Week ${lastWeek} — a V-shape pattern that often reflects a content-density spike followed by instructional adjustment. The Week ${minEntry.week} dip warrants ongoing monitoring.`
      : isInvertedV
      ? `Confidence peaked at ${maxEntry.avg.toFixed(1)} in Week ${maxEntry.week} before declining to ${lastWeekAvg.toFixed(1)} in Week ${lastWeek}. Review whether content complexity increased after Week ${maxEntry.week} and consider additional support.`
      : trendDelta > 0.2
      ? `Student confidence has improved over the course, rising from ${firstWeekAvg.toFixed(1)} in Week ${firstWeek} to ${lastWeekAvg.toFixed(1)} in Week ${lastWeek}.`
      : trendDelta < -0.2
      ? `Student confidence has declined over the course, from ${firstWeekAvg.toFixed(1)} in Week ${firstWeek} to ${lastWeekAvg.toFixed(1)} in Week ${lastWeek}. Consider reviewing pacing and scaffolding.`
      : `Student confidence has remained relatively stable throughout the course, averaging ${avgConfidence.toFixed(1)} out of 5.`;

  const supportNeedsSummary =
    supportRate >= 30
      ? `${Math.round(supportRate)}% of reflections indicated a support request — a significant share. Targeted intervention or additional support resources are recommended.`
      : supportRate >= 15
      ? `${Math.round(supportRate)}% of reflections included a support request. Monitoring is recommended, particularly for high-severity topics.`
      : `Support requests are low at ${Math.round(supportRate)}%, suggesting the majority of the class is managing the material well.`;

  const impactComparisons: Array<{
    topic: string;
    week: number;
    actionTaken: string;
    signal: string;
    beforePct: number;
    afterPct: number;
    improvement: number;
  }> = [];

  for (const action of actions) {
    const topicSignals = signals.filter((s) => {
      const ref = reflections.find((r) => r.id === s.reflectionId);
      return ref?.topic === action.topic;
    });
    const beforeSignals = topicSignals.filter((s) => {
      const ref = reflections.find((r) => r.id === s.reflectionId);
      return ref && ref.week <= action.week;
    });
    const afterSignals = topicSignals.filter((s) => {
      const ref = reflections.find((r) => r.id === s.reflectionId);
      return ref && ref.week > action.week;
    });
    if (beforeSignals.length < PRIVACY_MIN || afterSignals.length < PRIVACY_MIN) continue;

    const dominantSignal = topicMap[action.topic];
    if (!dominantSignal) continue;
    const mainSignal =
      Object.entries(dominantSignal.signalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Transfer Gap";

    const beforeCount = beforeSignals.filter((s) => s.primarySignal === mainSignal).length;
    const afterCount = afterSignals.filter((s) => s.primarySignal === mainSignal).length;
    const beforePct = beforeSignals.length > 0 ? (beforeCount / beforeSignals.length) * 100 : 0;
    const afterPct = afterSignals.length > 0 ? (afterCount / afterSignals.length) * 100 : 0;
    const improvement = beforePct - afterPct;

    if (Math.abs(improvement) >= 5) {
      impactComparisons.push({
        topic: action.topic,
        week: action.week,
        actionTaken: action.actionTaken,
        signal: mainSignal,
        beforePct: parseFloat(beforePct.toFixed(1)),
        afterPct: parseFloat(afterPct.toFixed(1)),
        improvement: parseFloat(improvement.toFixed(1)),
      });
    }
  }

  res.json({
    generatedAt: new Date().toISOString(),
    totalReflections,
    avgConfidence: parseFloat(avgConfidence.toFixed(2)),
    supportRate: parseFloat(supportRate.toFixed(1)),
    mostConfusingTopics,
    highestEngagementTopics,
    confidenceTrendSummary,
    supportNeedsSummary,
    instructionalActionsRecorded: actions.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
    impactComparisons,
    responsibleAiNote:
      "This report is generated from aggregated class-wide reflection data only. No individual student data, risk scores, or personal identifiers are included. CoursePulse AI is a faculty decision-support tool, not a grading, ranking, or surveillance system.",
  });
});

function buildThemeSummary(topic: string, signal: string, learningObjective: string): string {
  const lo = learningObjective ? ` (related to: ${learningObjective.toLowerCase()})` : "";
  switch (signal) {
    case "Transfer Gap":
      return `Students understand ${topic} conceptually but struggle to connect it to other course frameworks or real-world applications${lo}.`;
    case "Application Gap":
      return `Students need more concrete examples and practice opportunities to apply ${topic} concepts${lo}.`;
    case "Definitional Confusion":
      return `Key terminology in ${topic} is causing confusion — students need clearer definitions and vocabulary support${lo}.`;
    case "Pacing Concern":
      return `The pace of ${topic} content is creating pressure — students report difficulty keeping up with the volume of material${lo}.`;
    case "Support Need":
      return `A notable share of the class is experiencing difficulty with ${topic} and has signaled a need for additional support${lo}.`;
    default:
      return `${topic} shows elevated learning signals that warrant instructional attention${lo}.`;
  }
}

function getActionForSignal(signal: string): string {
  switch (signal) {
    case "Transfer Gap":
      return "Add a short case study or worked example connecting this topic to a broader course framework or real-world scenario.";
    case "Application Gap":
      return "Introduce a hands-on exercise or practice problem that gives students a concrete opportunity to apply the concept.";
    case "Definitional Confusion":
      return "Open the next session with a 5-minute vocabulary review and provide a one-page glossary for key terms.";
    case "Pacing Concern":
      return "Slow the pace, add a mid-session check-in, or break the material into smaller segments over multiple sessions.";
    case "Support Need":
      return "Reach out proactively and hold an additional office hours session or a structured review activity.";
    default:
      return "Review reflections holistically and consider adjusting the instructional approach for this topic.";
  }
}

function getRationaleForSignal(signal: string, topic: string): string {
  switch (signal) {
    case "Transfer Gap":
      return `Students appear to understand ${topic} in isolation but need help seeing how it connects to the broader course. Bridging examples reduce this gap.`;
    case "Application Gap":
      return `Declarative knowledge of ${topic} is not sufficient on its own — students need procedural practice to internalize the concept.`;
    case "Definitional Confusion":
      return `Ambiguous terminology in ${topic} is creating a cognitive barrier that prevents students from engaging with higher-level questions.`;
    case "Pacing Concern":
      return `When pacing exceeds students' processing capacity, surface-level understanding replaces deeper comprehension. Slowing down allows consolidation.`;
    case "Support Need":
      return `Early intervention for struggling students significantly improves retention and prevents compounding difficulty across subsequent weeks.`;
    default:
      return `Addressing learning signals early reduces the risk of compounding confusion and improves class-wide outcomes.`;
  }
}

function buildFacultyPriority(
  topTopic: string | null,
  signal: string,
  avgConf: number,
  supportPct: number
): string {
  if (supportPct >= 25) {
    return `Priority: Provide additional support resources — ${Math.round(supportPct)}% of the class requested help this week.`;
  }
  if (avgConf < 2.5) {
    return `Priority: Schedule a review session — class-wide confidence is low at ${avgConf.toFixed(1)}/5.`;
  }
  if (topTopic && signal !== "Comprehension" && signal !== "Engagement Signal") {
    return `Priority: Address ${signal.toLowerCase()} in "${topTopic}" — the most common concern this period.`;
  }
  return "The class appears to be progressing well. Consider enrichment activities or increasing application complexity.";
}

export default router;
