import { Router, type IRouter } from "express";
import healthRouter from "./health";
import courseContextRouter from "./courseContext";
import reflectionsRouter from "./reflections";
import facultyRouter from "./faculty";

const router: IRouter = Router();

router.use(healthRouter);
router.use(courseContextRouter);
router.use(reflectionsRouter);
router.use(facultyRouter);

export default router;
