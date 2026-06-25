import { Router, type IRouter } from "express";
import { db, reflectionsTable, classifiedSignalsTable } from "@workspace/db";
import { SubmitReflectionBody } from "@workspace/api-zod";
import { classifyReflection } from "../lib/classifier";

const router: IRouter = Router();

router.post("/reflections", async (req, res): Promise<void> => {
  const parsed = SubmitReflectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.reflectionText.length > 2000) {
    res.status(400).json({ error: "Reflection text must be 2000 characters or fewer." });
    return;
  }

  const { consentGiven, ...reflectionData } = parsed.data;

  if (!consentGiven) {
    res.status(400).json({ error: "Consent is required to submit a reflection." });
    return;
  }

  const [reflection] = await db
    .insert(reflectionsTable)
    .values(reflectionData)
    .returning();

  const classification = classifyReflection(
    reflection.reflectionText,
    reflection.topic,
    reflection.confidenceScore
  );

  const [signal] = await db
    .insert(classifiedSignalsTable)
    .values({
      reflectionId: reflection.id,
      ...classification,
    })
    .returning();

  res.status(201).json({ reflection, signal });
});

export default router;
