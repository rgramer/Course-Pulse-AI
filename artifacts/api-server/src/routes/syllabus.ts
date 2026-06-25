import { Router, type IRouter } from "express";
import multer from "multer";
import mammoth from "mammoth";
import { db, courseContextTable } from "@workspace/db";
import { requireFacultyAuth } from "../middleware/facultyAuth";

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
    if (allowed.includes(file.mimetype) || file.originalname.endsWith(".docx") || file.originalname.endsWith(".txt")) {
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

function parseSyllabusText(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows: ParsedRow[] = [];
  let currentWeek = 0;
  let currentTopic = "";
  let currentObjective = "";
  let currentReading = "";
  let currentAssignment = "";

  const weekRe = /^week\s+(\d+)/i;
  const objectiveRe = /learning\s+objective|students\s+will\s+(be\s+able\s+to)?|by\s+the\s+end\s+of|objective[s]?:/i;
  const readingRe = /^readings?[:\s]|^article[:\s]|^chapter\s+\d|^textbook[:\s]/i;
  const assignmentRe = /^assignment[:\s]|^lab[:\s]|^workshop[:\s]|^project[:\s]|^deliverable[:\s]/i;

  const saveCurrentRow = () => {
    if (currentWeek > 0 && currentTopic) {
      rows.push({
        week: currentWeek,
        topic: currentTopic,
        learningObjective: currentObjective,
        reading: currentReading,
        assignment: currentAssignment,
      });
    }
  };

  for (const line of lines) {
    const weekMatch = line.match(weekRe);
    if (weekMatch) {
      saveCurrentRow();
      currentWeek = parseInt(weekMatch[1], 10);
      const afterWeek = line.replace(weekRe, "").replace(/^[\s:–\-]+/, "").trim();
      currentTopic = afterWeek;
      currentObjective = "";
      currentReading = "";
      currentAssignment = "";
    } else if (objectiveRe.test(line) && currentWeek > 0) {
      const val = line.replace(objectiveRe, "").replace(/^[\s:]+/, "").trim();
      if (val.length > 3) currentObjective = val;
      else currentObjective = line;
    } else if (readingRe.test(line) && currentWeek > 0) {
      const val = line.replace(readingRe, "").replace(/^[\s:]+/, "").trim();
      currentReading = val || line;
    } else if (assignmentRe.test(line) && currentWeek > 0) {
      const val = line.replace(assignmentRe, "").replace(/^[\s:]+/, "").trim();
      currentAssignment = val || line;
    } else if (currentWeek > 0 && !currentTopic && line.length > 2 && line.length < 120) {
      currentTopic = line;
    }
  }
  saveCurrentRow();

  return rows;
}

router.post("/faculty/syllabus/extract", requireFacultyAuth, upload.single("file"), async (req, res): Promise<void> => {
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

  const rows = parseSyllabusText(text);
  res.json({ rows, rawLength: text.length });
});

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
    (r) => typeof r.week === "number" && r.week > 0 && typeof r.topic === "string" && r.topic.trim().length > 0
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
