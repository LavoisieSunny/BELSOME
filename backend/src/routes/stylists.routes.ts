import { Router } from "express";
import * as controller from "../controllers/stylists.controller";

const router = Router();

router.get("/", controller.getStylists);
router.get("/:id/success-rate", controller.getStylistSuccessRate);
router.get("/:id", controller.getStylistById);
router.post("/", controller.createStylist);

export default router;
