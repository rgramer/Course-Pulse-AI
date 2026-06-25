/**
 * Demo seed script — populates CoursePulse AI with realistic data
 * matching the presentation examples (Diffusion of Innovation use case,
 * W1: 4.2 → W2: 3.8 → W3: 3.4 confidence trend).
 *
 * Safe to run multiple times — skips if data already exists.
 * Run: pnpm --filter @workspace/scripts run seed
 */
import { db } from "@workspace/db";
import {
  courseContextTable,
  reflectionsTable,
  classifiedSignalsTable,
  facultyActionsTable,
} from "@workspace/db";

async function seed() {
  console.log("🌱 CoursePulse AI — demo seed starting…");

  // ── Guard: skip if reflections already exist ──────────────────────────────
  const existing = await db.select().from(reflectionsTable);
  if (existing.length > 0) {
    console.log(`⏭  ${existing.length} reflections already present — skipping seed.`);
    console.log("   To reseed, clear the tables first.");
    process.exit(0);
  }

  // ── 1. Course Context ─────────────────────────────────────────────────────
  console.log("→ Inserting course context…");
  await db.insert(courseContextTable).values([
    {
      week: 1,
      topic: "Foundations of Emerging Technologies",
      learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
      reading: "Rogers (2003) — Diffusion of Innovations, Ch. 1",
      assignment: undefined,
    },
    {
      week: 2,
      topic: "Diffusion of Innovation Theory",
      learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
      reading: "Rogers (2003) — Ch. 5–7; Christensen (1997) — The Innovator's Dilemma, Ch. 1",
      assignment: "Case Brief: Map one emerging technology to the diffusion curve",
    },
    {
      week: 3,
      topic: "AI Governance & Ethics",
      learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
      reading: "EU AI Act (2024) summary; NIST AI RMF Overview; FERPA & GDPR comparison brief",
      assignment: "Governance Memo: Propose an AI policy for a higher-ed institution",
    },
  ]);

  // ── 2. Reflections + Classified Signals ──────────────────────────────────
  // Week 1 — avg confidence ≈ 4.2 (high engagement, comprehension)
  // Week 2 — avg confidence ≈ 3.9 (application gap dominant — matches slide 7)
  // Week 3 — avg confidence ≈ 3.1 (pacing concern, some support need)
  console.log("→ Inserting reflections and signals…");

  const reflectionData: Array<{
    reflection: typeof reflectionsTable.$inferInsert;
    signal: Omit<typeof classifiedSignalsTable.$inferInsert, "reflectionId">;
  }> = [
    // ── Week 1: Foundations ───────────────────────────────────────────────
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 5, supportRequested: false,
        reflectionText: "I found this week's content really interesting and engaging. The overview of AI, IoT, and blockchain categories was clear and I'm excited to explore how these connect to business strategy.",
      },
      signal: {
        primarySignal: "Engagement Signal", secondarySignal: "Comprehension", severityScore: 0,
        themeSummary: "Student shows curiosity, motivation, or enthusiasm about Foundations of Emerging Technologies.",
        recommendedAction: "Capitalize on engagement by connecting upcoming topics to students' expressed interests and curiosity.",
      },
    },
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "I understand the key frameworks introduced this week and feel confident following along. The examples made the concepts click — especially how technology adoption differs across sectors.",
      },
      signal: {
        primarySignal: "Comprehension", secondarySignal: null, severityScore: 0,
        themeSummary: "Student demonstrates positive comprehension and engagement with Foundations of Emerging Technologies content.",
        recommendedAction: "Continue current instructional approach. Consider increasing challenge or extending application opportunities.",
      },
    },
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 5, supportRequested: false,
        reflectionText: "Loved the introduction — this is very relevant to my work. The IoT and AI sections were fascinating. I'm motivated to read more before next class.",
      },
      signal: {
        primarySignal: "Engagement Signal", secondarySignal: null, severityScore: 0,
        themeSummary: "Student shows curiosity, motivation, or enthusiasm about Foundations of Emerging Technologies.",
        recommendedAction: "Capitalize on engagement by connecting upcoming topics to students' expressed interests and curiosity.",
      },
    },
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "The lecture was well-organized. I grasped the foundational concepts and the progression from basic to complex felt manageable. Looking forward to how we apply these next week.",
      },
      signal: {
        primarySignal: "Comprehension", secondarySignal: null, severityScore: 0,
        themeSummary: "Student demonstrates positive comprehension and engagement with Foundations of Emerging Technologies content.",
        recommendedAction: "Continue current instructional approach. Consider increasing challenge or extending application opportunities.",
      },
    },
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "This is useful and directly connects to topics I care about professionally. The material on platform ecosystems was particularly interesting.",
      },
      signal: {
        primarySignal: "Engagement Signal", secondarySignal: "Comprehension", severityScore: 0,
        themeSummary: "Student shows curiosity, motivation, or enthusiasm about Foundations of Emerging Technologies.",
        recommendedAction: "Capitalize on engagement by connecting upcoming topics to students' expressed interests and curiosity.",
      },
    },
    {
      reflection: {
        week: 1, topic: "Foundations of Emerging Technologies",
        learningObjective: "Identify key categories of emerging technologies and explain their societal impact",
        confidenceScore: 3, supportRequested: false,
        reflectionText: "I understand the basics but I'm not sure how to apply them to a specific industry case yet. I would benefit from examples of how each tech category maps to business decisions.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: null, severityScore: 2,
        themeSummary: "Student understands Foundations of Emerging Technologies theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },

    // ── Week 2: Diffusion of Innovation — the slide 7 use case ───────────
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 5, supportRequested: false,
        reflectionText: "I understand the theory of Diffusion of Innovation, but I struggle to apply it to real companies. The curve makes sense in the abstract but I need concrete examples to make the connection.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: null, severityScore: 1,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 4, supportRequested: true,
        reflectionText: "The diffusion curve makes sense but I don't know how to use it in practice. I'd love a hands-on exercise where we map a real technology to the adoption stages.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: null, severityScore: 1,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "I get Rogers' framework but I'm not sure how to apply it to AI adoption specifically. How do we classify early adopters versus early majority when the technology changes so fast?",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: "Transfer Gap", severityScore: 1,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 3, supportRequested: false,
        reflectionText: "I understand diffusion curves but can't connect them to real-world cases. How does this apply to something like ChatGPT or generative AI? I'd like a worked example.",
      },
      signal: {
        primarySignal: "Transfer Gap", secondarySignal: "Application Gap", severityScore: 2,
        themeSummary: "Student understands the basic concept of Diffusion of Innovation Theory but struggles to connect it to other frameworks or real-world contexts.",
        recommendedAction: "Provide a worked example connecting the topic to a current technology or real-world case. Use analogies to bridge concepts.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "I found the material interesting, but I need more practice applying it. I'd benefit from a case study that shows how a technology moves through the adoption lifecycle.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: "Engagement Signal", severityScore: 1,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "The lecture was clear but theoretical. What does 'crossing the chasm' look like for enterprise AI tools today? Concrete examples would help me internalize the framework.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: null, severityScore: 1,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },
    {
      reflection: {
        week: 2, topic: "Diffusion of Innovation Theory",
        learningObjective: "Apply Rogers' Diffusion of Innovation framework to analyze technology adoption patterns",
        confidenceScore: 3, supportRequested: true,
        reflectionText: "I'm not fully confident yet. The concept makes sense but applying it feels fuzzy. I would really benefit from a practice problem or assignment before we move on.",
      },
      signal: {
        primarySignal: "Application Gap", secondarySignal: null, severityScore: 2,
        themeSummary: "Student understands Diffusion of Innovation Theory theoretically but is uncertain how to apply or practice the concept concretely.",
        recommendedAction: "Add a hands-on exercise, case study, or practice problem that gives students a concrete opportunity to apply the concept.",
      },
    },

    // ── Week 3: AI Governance & Ethics — pacing concern ───────────────────
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 2, supportRequested: true,
        reflectionText: "This week's material on AI governance moved too fast. There were too many frameworks covered — FERPA, GDPR, NIST — and I'm struggling to keep up and differentiate them.",
      },
      signal: {
        primarySignal: "Pacing Concern", secondarySignal: "Support Need", severityScore: 2,
        themeSummary: "Student finds the pacing of AI Governance & Ethics content too fast or the volume too high to process effectively.",
        recommendedAction: "Consider slowing the pace for the next session, adding a review activity, or breaking concepts into smaller segments.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 3, supportRequested: false,
        reflectionText: "There's too much content for one session. We covered a lot of ground quickly and I'm not sure what to prioritize. A summary or comparison chart of the frameworks would really help.",
      },
      signal: {
        primarySignal: "Pacing Concern", secondarySignal: null, severityScore: 2,
        themeSummary: "Student finds the pacing of AI Governance & Ethics content too fast or the volume too high to process effectively.",
        recommendedAction: "Consider slowing the pace for the next session, adding a review activity, or breaking concepts into smaller segments.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 2, supportRequested: true,
        reflectionText: "I'm a bit overwhelmed. The pace of the governance section was too fast and I got lost connecting the different regulatory frameworks. I need help before the assignment.",
      },
      signal: {
        primarySignal: "Support Need", secondarySignal: "Pacing Concern", severityScore: 3,
        themeSummary: "Student is experiencing significant difficulty with AI Governance & Ethics and has requested or implied a need for additional instructional support.",
        recommendedAction: "Reach out proactively with office hours or an additional support session. Consider offering a brief check-in with struggling students.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "The content is interesting but we moved quickly through the responsible AI principles. I'd like more time on how these apply to real organizational AI policy decisions.",
      },
      signal: {
        primarySignal: "Pacing Concern", secondarySignal: "Application Gap", severityScore: 1,
        themeSummary: "Student finds the pacing of AI Governance & Ethics content too fast or the volume too high to process effectively.",
        recommendedAction: "Consider slowing the pace for the next session, adding a review activity, or breaking concepts into smaller segments.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "I understand the basic principles but can't connect them to real organizational decision-making. What would it look like to actually implement an AI governance framework at a company?",
      },
      signal: {
        primarySignal: "Transfer Gap", secondarySignal: null, severityScore: 1,
        themeSummary: "Student understands the basic concept of AI Governance & Ethics but struggles to connect it to other frameworks or real-world contexts.",
        recommendedAction: "Provide a worked example connecting the topic to a current technology or real-world case. Use analogies to bridge concepts.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 3, supportRequested: true,
        reflectionText: "I need more help understanding the governance frameworks. The material is dense and I feel like I'm only getting the surface level. Office hours would help.",
      },
      signal: {
        primarySignal: "Support Need", secondarySignal: null, severityScore: 3,
        themeSummary: "Student is experiencing significant difficulty with AI Governance & Ethics and has requested or implied a need for additional instructional support.",
        recommendedAction: "Reach out proactively with office hours or an additional support session. Consider offering a brief check-in with struggling students.",
      },
    },
    {
      reflection: {
        week: 3, topic: "AI Governance & Ethics",
        learningObjective: "Evaluate responsible AI principles and their application to organizational decision-making",
        confidenceScore: 4, supportRequested: false,
        reflectionText: "I'm curious about how AI governance plays out in practice, but the session covered a lot of ground. A structured comparison of NIST vs EU AI Act vs FERPA would help me organize my thinking.",
      },
      signal: {
        primarySignal: "Pacing Concern", secondarySignal: "Engagement Signal", severityScore: 1,
        themeSummary: "Student finds the pacing of AI Governance & Ethics content too fast or the volume too high to process effectively.",
        recommendedAction: "Consider slowing the pace for the next session, adding a review activity, or breaking concepts into smaller segments.",
      },
    },
  ];

  for (const { reflection, signal } of reflectionData) {
    const [inserted] = await db.insert(reflectionsTable).values(reflection).returning();
    await db.insert(classifiedSignalsTable).values({ ...signal, reflectionId: inserted.id });
  }

  // ── 3. Faculty Actions ────────────────────────────────────────────────────
  console.log("→ Inserting faculty actions…");
  await db.insert(facultyActionsTable).values([
    {
      week: 2,
      topic: "Diffusion of Innovation Theory",
      actionTaken: "Added real-world case study: mapped ChatGPT adoption (2022–2024) to Rogers' Diffusion of Innovation stages. Students analyzed adopter category transitions using actual market data and user growth curves.",
      reason: "Dashboard showed 6/7 Week 2 reflections flagged Application Gap — students understand theory but cannot apply it to real technologies.",
    },
    {
      week: 3,
      topic: "AI Governance & Ethics",
      actionTaken: "Reduced next session scope. Added a structured framework comparison table (FERPA, GDPR, NIST AI RMF, EU AI Act) as a take-home reference sheet. Opening 30 minutes of next class will be a guided Q&A review.",
      reason: "Pacing Concern flagged in 4/7 reflections. Two students explicitly requested support. Governance content density was too high for a single session.",
    },
  ]);

  console.log("✅ Seed complete!");
  console.log("   • 3 course context rows");
  console.log(`   • ${reflectionData.length} reflections + classified signals`);
  console.log("   • 2 faculty actions");
  console.log("\n   Confidence trend: W1 ≈ 4.2 → W2 ≈ 3.9 → W3 ≈ 3.1 (matches presentation slide 10)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
