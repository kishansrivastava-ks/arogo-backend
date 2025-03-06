import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("role", "Role is required").isIn(["patient", "doctor"]),
  ],
  registerUser
);

router.post("/login", loginUser);
router.post("/logout", logoutUser);

// get your profile
router.get("/me", protect, getUserProfile);

export default router;
