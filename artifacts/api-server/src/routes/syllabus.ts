import { Router, type IRouter } from "express";
import multer from "multer";
import mammoth from "mammoth";
import { db, courseContextTable } from "@workspace/db";
import { requireFacultyAuth } from "../middleware/facultyAuth";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

const MAX_IMPORT_ROWS = 100;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (
      allowed.includes(file.mimetype) ||
      file.originalname.endsWith(".docx") ||
      file.originalname.endsWith(".txt")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .docx and .txt files are supported"));
    }
  },
});

interface ParsedRow {
  week: number;
  topic: string;
  learningObjective: string;
  reading: string;
  assignment: string;
}

async function extractSyllabusWithAI(text: string): Promise<ParsedRow[]> {
  const prompt = `You are a syllabus parser. Extract the weekly course structure from the following syllabus text and return it as a JSON array.

For each week or module found, extract:
- week: the week or session number (integer). If the syllabus uses "Module" or "Session" instead of "Week", use the number as-is.
- topic: the main topic or title for that week (string)
- learningObjective: the learning objective(s) for that week. Look for phrases like "students will", "by the end of", "learning objectives", "you will be able to". Combine multiple objectives into one string separated by semicolons. Empty string if not found.
- reading: any assigned readings, articles, chapters, or textbook sections. Combine into one string. Empty string if not found.
- assignment: any assignments, labs, projects, deliverables, or homework. Combine into one string. Empty string if not found.

Rules:
- Only include weeks/sessions/modules that have a clear topic title.
- If a week has a date instead of a number (e.g. "January 15"), assign sequential integers starting from 1.
- Keep topic titles concise — remove redundant prefixes like "Week 1:" from the topic field.
- Return ONLY valid JSON, no explanation, no markdown fences — just the raw JSON array.

Example output format:
[{"week":1,"topic":"Introduction to Data Science","learningObjective":"Students will understand the data science lifecycle","reading":"Chapter 1: Introduction","assignment":"Quiz 1 due Friday"},{"week":2,"topic":"Data Wrangling","learningObjective":"","reading":"","assignment":""}]

Syllabus text:
${text.slice(0, 12000)}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") return [];

  const raw = block.text.trim();
  const jsonText = raw.startsWith("[") ? raw : raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const parsed = JSON.parse(jsonText) as unknown[];
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (r): r is Record<string, unknown> =>
        typeof r === "object" && r !== null && typeof (r as Record<string, unknown>).week === "number"
    )
    .map((r) => ({
      week: r.week as number,
      topic: typeof r.topic === "string" ? r.topic.trim() : "",
      learningObjective: typeof r.learningObjective === "string" ? r.learningObjective.trim() : "",
      reading: typeof r.reading === "string" ? r.reading.trim() : "",
      assignment: typeof r.assignment === "string" ? r.assignment.trim() : "",
    }))
    .filter((r) => r.week > 0 && r.topic.length > 0);
}

router.post(
  "/faculty/syllabus/extract",
  requireFacultyAuth,
  upload.single("file"),
  async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded. Please upload a .docx or .txt file." });
      return;
    }

    let text = "";

    try {
      if (req.file.mimetype === "text/plain" || req.file.originalname.endsWith(".txt")) {
        text = req.file.buffer.toString("utf-8");
      } else {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = result.value;
      }
    } catch {
      res.status(422).json({ error: "Could not read file. Make sure it is a valid .docx or .txt file." });
      return;
    }

    if (!text.trim()) {
      res.status(422).json({ error: "The uploaded file appears to be empty or could not be parsed." });
      return;
    }

    try {
      const rows = await extractSyllabusWithAI(text);
      if (rows.length === 0) {
        res.status(422).json({
          error:
            "No weekly structure could be detected in this syllabus. Make sure the document contains week or module headings.",
        });
        return;
      }
      res.json({ rows, rawLength: text.length });
    } catch (err) {
      req.log.error({ err }, "Syllabus AI extraction failed");
      res.status(500).json({ error: "Failed to extract syllabus structure. Please try again." });
    }
  }
);

router.post("/faculty/syllabus/import", requireFacultyAuth, async (req, res): Promise<void> => {
  const { rows } = req.body as { rows: ParsedRow[] };

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({ error: "No rows provided for import." });
    return;
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    res.status(400).json({ error: `Import limited to ${MAX_IMPORT_ROWS} rows at a time.` });
    return;
  }

  const valid = rows.filter(
    (r) =>
      typeof r.week === "number" &&
      r.week > 0 &&
      typeof r.topic === "string" &&
      r.topic.trim().length > 0
  );

  if (valid.length === 0) {
    res.status(400).json({ error: "No valid rows found. Each row must have a week number and topic." });
    return;
  }

  await db.insert(courseContextTable).values(
    valid.map((r) => ({
      week: r.week,
      topic: r.topic.trim(),
      learningObjective: (r.learningObjective || "").trim(),
      reading: (r.reading || "").trim(),
      assignment: (r.assignment || "").trim(),
    }))
  );

  res.json({ imported: valid.length });
});

export default router;
