import { Router } from "express";
import * as controller from "../controllers/services.controller";

const router = Router();

router.get("/", controller.getServices);

export default router;
