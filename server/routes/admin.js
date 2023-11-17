import express from "express";
import Controller from "../controllers/admin.js";
import { authenticateToken } from "../middleware/authorization.js";
import { checkAdminRole } from "../middleware/checkAdminRole.js";

const router = express.Router();

router.post("/doctor-add", authenticateToken,checkAdminRole, Controller.addDoctor);
router.get("/doctors", authenticateToken,checkAdminRole, Controller.getAllDoctors);
router.delete("/doctor/:id", authenticateToken,checkAdminRole, Controller.deleteDoctor);
router.put("/doctor/:id", authenticateToken, Controller.updateDoctor);


router.post("/schedule-create",authenticateToken,checkAdminRole,Controller.createSchedule);
router.get("/doctor-schedule/:id",authenticateToken, checkAdminRole,Controller.getSchedule);
router.get("/doctor-schedules",authenticateToken, checkAdminRole,Controller.getAllSchedules);
router.delete("/doctor-schedule/:id",authenticateToken,checkAdminRole,Controller.deleteSchedule)

export default router;
