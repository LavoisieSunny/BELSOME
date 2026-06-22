import { Router } from "express";
import * as controller from "../controllers/salons.controller";

const router = Router();

router.get("/", controller.getSalons);
router.get("/:id", controller.getSalonById);

export default router;
