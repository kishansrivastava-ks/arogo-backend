import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getDoctorAppointments,
} from "../controllers/appointmentController.js";
import { protect, doctorOnly } from "../middleware/authMiddleware.js";
import { getPatientAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book", protect, bookAppointment); // Patients book appointments
router.post("/cancel", protect, cancelAppointment); // Patients cancel appointments
router.get("/doctor", protect, doctorOnly, getDoctorAppointments); // Doctors view appointments

router.get("/patient", protect, getPatientAppointments); // for patients to get their appointments

export default router;
