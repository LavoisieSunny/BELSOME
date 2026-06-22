import { Router } from "express";
import * as controller from "../controllers/exam-attempts.controller";

const router = Router();

router.get("/", controller.getAttempts);
router.post("/", controller.createAttempt);

export default router;
