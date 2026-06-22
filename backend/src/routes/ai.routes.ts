import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();

router.post("/concierge", AIController.concierge);
router.post("/style-dna", AIController.styleDNA);
router.post("/be-next-hero", AIController.beNextHero);
router.post("/look-finder", AIController.lookFinder);
router.post("/procurement", AIController.procurement);
router.post("/behavioral-exam", AIController.behavioralExam);
router.post("/analyze-selfie", AIController.analyzeSelfie);
router.post("/pricing-forecast", AIController.pricingForecast);
router.post("/generate-share-message", AIController.generateShareMessage);
router.post("/belsome-score", AIController.belsomeScore);
router.post("/wedding-planner", AIController.weddingPlanner);
router.post("/price-reasoning", AIController.priceReasoning);

export default router;
