import { Router } from "express";
import * as controller from "../controllers/appointments.controller";

const router = Router();

router.get("/", controller.getAppointments);
router.post("/", controller.createAppointment);
router.patch("/:id", controller.updateAppointmentStatus);

export default router;
