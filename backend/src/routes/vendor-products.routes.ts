import { Router } from "express";
import * as controller from "../controllers/vendor-products.controller";

const router = Router();

router.get("/", controller.getProducts);
router.post("/", controller.createProduct);

export default router;
