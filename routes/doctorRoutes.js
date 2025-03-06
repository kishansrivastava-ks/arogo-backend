import express from "express";
import { searchDoctors } from "../controllers/doctorController.js";
import { doctorOnly, protect } from "../middleware/authMiddleware.js";
import { updateAvailability } from "../controllers/doctorController.js";
import { getDoctorProfile } from "../controllers/doctorController.js";

const router = express.Router();

// Search Doctors
router.get("/search", searchDoctors);

// to update the availability
router.put("/update-availability", protect, doctorOnly, updateAvailability);

router.get("/:doctorId", getDoctorProfile);

export default router;
