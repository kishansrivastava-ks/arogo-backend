import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, specialty, experience, location } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    // If user is a doctor, create doctor profile
    if (role === "doctor") {
      const doctor = new Doctor({
        user: user._id,
        specialty,
        experience,
        location,
        availability: [],
      });
      await doctor.save();
    }

    // Generate JWT Token
    generateToken(res, user._id);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    generateToken(res, user._id);

    res
      .status(200)
      .json({ message: "Login successful", userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};

// get user profile
// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password"); // Exclude password

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

export const getUserProfile = async (req, res) => {
  try {
    // Fetch user details from User schema
    const user = await User.findById(req.user._id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is a doctor, fetch details from Doctor schema
    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: user._id });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialty: doctor.specialty,
          experience: doctor.experience,
          location: doctor.location,
          availability: doctor.availability,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    // If user is a patient, return user details
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
