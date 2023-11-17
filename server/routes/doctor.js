import express from "express";
import Controller from "../controllers/doctor.js";
import { authenticateToken } from "../middleware/authorization.js";
import { checkDoctorRole } from "../middleware/checkDoctorRole.js";

const router=express.Router()


router.get("/patients",authenticateToken,checkDoctorRole, Controller.getPatients)

router.post("/receipts",authenticateToken,checkDoctorRole, Controller.createReceipts)

router.get("/available-medications",authenticateToken,checkDoctorRole,Controller.getAvailableMedications)
router.get("/schedule",authenticateToken,checkDoctorRole,Controller.getSchedule)
router.get("/medcard/:id",authenticateToken,checkDoctorRole,Controller.getMedcard)

export default router