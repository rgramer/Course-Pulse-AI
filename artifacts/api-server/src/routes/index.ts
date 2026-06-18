import { Router, type IRouter } from "express";
import healthRouter from "./health";
import courseContextRouter from "./courseContext";
import reflectionsRouter from "./reflections";
import facultyRouter from "./faculty";
import syllabusRouter from "./syllabus";

const router: IRouter = Router();

router.use(healthRouter);
router.use(courseContextRouter);
router.use(reflectionsRouter);
router.use(facultyRouter);
router.use(syllabusRouter);

export default router;
