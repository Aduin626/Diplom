import express from "express";
import Controller from "../controllers/admin.js";
import multer from 'multer';

import { authenticateToken } from "../middleware/authorization.js";
import { checkAdminRole } from "../middleware/checkAdminRole.js";

const router = express.Router();


const upload = multer({ dest: 'uploads/' });

router.post("/upload-doctors-excel",upload.single('file'),authenticateToken,checkAdminRole, Controller.addDoctorsFromExcel);

router.post("/doctor-add", authenticateToken,checkAdminRole, Controller.addDoctor);
router.get("/doctors", authenticateToken,checkAdminRole, Controller.getAllDoctors);
router.delete("/doctor/:id", authenticateToken,checkAdminRole, Controller.deleteDoctor);
router.put("/doctor/:id", authenticateToken, Controller.updateDoctor);
router.get('/doctor/:id',authenticateToken, Controller.getDoctorById);


router.post("/schedule-create",authenticateToken,checkAdminRole,Controller.createSchedule);
router.get("/doctor-schedule/:id",authenticateToken, checkAdminRole,Controller.getSchedule);
router.get("/doctor-schedules",authenticateToken, checkAdminRole,Controller.getAllSchedules);
router.delete("/doctor-schedule/:id",authenticateToken,checkAdminRole,Controller.deleteSchedule)

export default router;
