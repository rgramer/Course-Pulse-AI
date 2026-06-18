import { Router, type IRouter } from "express";
import { db, courseContextTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListCourseContextsResponse,
  CreateCourseContextBody,
  UpdateCourseContextParams,
  UpdateCourseContextBody,
  UpdateCourseContextResponse,
  DeleteCourseContextParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/topics", async (req, res): Promise<void> => {
  const rows = await db.selectDistinct({ topic: courseContextTable.topic }).from(courseContextTable);
  const topics = rows.map((r) => r.topic);
  res.json(topics);
});

router.get("/course-contexts", async (req, res): Promise<void> => {
  const rows = await db.select().from(courseContextTable).orderBy(courseContextTable.week);
  res.json(ListCourseContextsResponse.parse(rows));
});

router.post("/course-contexts", async (req, res): Promise<void> => {
  const parsed = CreateCourseContextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(courseContextTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/course-contexts/:id", async (req, res): Promise<void> => {
  const params = UpdateCourseContextParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCourseContextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(courseContextTable)
    .set(parsed.data)
    .where(eq(courseContextTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Course context not found" });
    return;
  }
  res.json(UpdateCourseContextResponse.parse(row));
});

router.delete("/course-contexts/:id", async (req, res): Promise<void> => {
  const params = DeleteCourseContextParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(courseContextTable)
    .where(eq(courseContextTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Course context not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
