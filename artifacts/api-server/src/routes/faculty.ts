import { Router, type IRouter } from "express";
import { db, reflectionsTable, classifiedSignalsTable, facultyActionsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  VerifyFacultyAccessBody,
  ListFacultyActionsResponse,
  CreateFacultyActionBody,
} from "@workspace/api-zod";

const FACULTY_ACCESS_CODE = "faculty-demo";

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
  res.json({ success: true });
});

router.get("/faculty/dashboard", async (_req, res): Promise<void> => {
  const reflections = await db.select().from(reflectionsTable);
  const signals = await db.select().from(classifiedSignalsTable);

  const totalReflections = reflections.length;

  const avgConfidenceScore =
    totalReflections > 0
      ? reflections.reduce((sum, r) => sum + r.confidenceScore, 0) / totalReflections
      : 0;

  const supportCount = reflections.filter((r) => r.supportRequested).length;
  const percentRequestingSupport =
    totalReflections > 0 ? (supportCount / totalReflections) * 100 : 0;

  const signalCountMap: Record<string, number> = {};
  for (const s of signals) {
    signalCountMap[s.primarySignal] = (signalCountMap[s.primarySignal] ?? 0) + 1;
  }

  const signalDistribution = Object.entries(signalCountMap)
    .map(([signal, count]) => ({ signal, count }))
    .sort((a, b) => b.count - a.count);

  const mostCommonSignal = signalDistribution[0]?.signal ?? "No data";

  const topicMap: Record<string, { totalSeverity: number; count: number; signalCounts: Record<string, number> }> = {};
  for (let i = 0; i < signals.length; i++) {
    const sig = signals[i];
    const ref = reflections.find((r) => r.id === sig.reflectionId);
    if (!ref) continue;
    const topic = ref.topic;
    if (!topicMap[topic]) {
      topicMap[topic] = { totalSeverity: 0, count: 0, signalCounts: {} };
    }
    topicMap[topic].totalSeverity += sig.severityScore;
    topicMap[topic].count++;
    topicMap[topic].signalCounts[sig.primarySignal] =
      (topicMap[topic].signalCounts[sig.primarySignal] ?? 0) + 1;
  }

  const topicConfusion = Object.entries(topicMap)
    .map(([topic, data]) => {
      const avgSeverity = data.count > 0 ? data.totalSeverity / data.count : 0;
      const mostCommonSignal = Object.entries(data.signalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";
      return { topic, avgSeverity, count: data.count, mostCommonSignal };
    })
    .sort((a, b) => b.avgSeverity - a.avgSeverity);

  const highestConcernTopic = topicConfusion[0]?.topic ?? null;

  const weekMap: Record<number, { totalConfidence: number; count: number }> = {};
  for (const r of reflections) {
    if (!weekMap[r.week]) weekMap[r.week] = { totalConfidence: 0, count: 0 };
    weekMap[r.week].totalConfidence += r.confidenceScore;
    weekMap[r.week].count++;
  }

  const confidenceTrend = Object.entries(weekMap)
    .map(([week, data]) => ({
      week: parseInt(week, 10),
      avgConfidence: data.count > 0 ? data.totalConfidence / data.count : 0,
      reflectionCount: data.count,
    }))
    .sort((a, b) => a.week - b.week);

  const topConfusionThemes = topicConfusion
    .filter((t) => t.avgSeverity >= 1.5)
    .slice(0, 5)
    .map((t) => `${t.topic}: ${t.mostCommonSignal} (avg severity ${t.avgSeverity.toFixed(1)})`);

  const recommendedAdjustments: string[] = [];
  for (const topic of topicConfusion.slice(0, 3)) {
    if (topic.avgSeverity >= 2) {
      recommendedAdjustments.push(
        `Re-examine instructional approach for "${topic.topic}" — high confusion signals detected across ${topic.count} reflections.`
      );
    } else if (topic.avgSeverity >= 1) {
      recommendedAdjustments.push(
        `Consider adding a supplemental example or review activity for "${topic.topic}".`
      );
    }
  }
  if (percentRequestingSupport >= 20) {
    recommendedAdjustments.push(
      `${Math.round(percentRequestingSupport)}% of students requested support — consider holding an open office hours session.`
    );
  }
  if (avgConfidenceScore < 2.5) {
    recommendedAdjustments.push("Class-wide confidence is low — consider a mid-week check-in or review session.");
  }

  res.json({
    totalReflections,
    avgConfidenceScore: parseFloat(avgConfidenceScore.toFixed(2)),
    mostCommonSignal,
    highestConcernTopic,
    percentRequestingSupport: parseFloat(percentRequestingSupport.toFixed(1)),
    signalDistribution,
    topicConfusion,
    confidenceTrend,
    topConfusionThemes,
    recommendedAdjustments,
  });
});

router.get("/faculty/actions", async (_req, res): Promise<void> => {
  const rows = await db.select().from(facultyActionsTable).orderBy(facultyActionsTable.week);
  res.json(ListFacultyActionsResponse.parse(rows));
});

router.post("/faculty/actions", async (req, res): Promise<void> => {
  const parsed = CreateFacultyActionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(facultyActionsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/faculty/signals", async (_req, res): Promise<void> => {
  const signals = await db.select().from(classifiedSignalsTable);
  const reflections = await db.select().from(reflectionsTable);

  const result = signals.map((s) => {
    const ref = reflections.find((r) => r.id === s.reflectionId);
    return {
      ...s,
      week: ref?.week ?? 0,
      topic: ref?.topic ?? "",
      learningObjective: ref?.learningObjective ?? "",
    };
  });

  res.json(result);
});

export default router;
