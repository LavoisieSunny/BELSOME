import { Router } from "express";
import * as controller from "../controllers/corporate-accounts.controller";

const router = Router();

router.get("/", controller.getCorporateAccounts);

export default router;
