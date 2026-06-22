import { Router } from "express";
import * as controller from "../controllers/wedding-projects.controller";

const router = Router();

router.get("/:id", controller.getWeddingProjectById);

export default router;
