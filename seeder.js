import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";

dotenv.config();
connectDB();

const doctors = [
  {
    name: "Dr. Aman Khanna",
    email: "aman.khanna@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Cardiologist",
    experience: 12,
    location: { city: "Delhi", state: "Delhi" },
    availability: [
      { date: "2025-03-07", slots: ["10:00 AM", "11:00 AM", "4:00 PM"] },
    ],
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Dermatologist",
    experience: 8,
    location: { city: "Mumbai", state: "Maharashtra" },
    availability: [
      { date: "2025-03-07", slots: ["9:00 AM", "2:00 PM", "3:30 PM"] },
    ],
  },
  {
    name: "Dr. Rajeev Menon",
    email: "rajeev.menon@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Orthopedic Surgeon",
    experience: 15,
    location: { city: "Bangalore", state: "Karnataka" },
    availability: [
      { date: "2025-03-07", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
    ],
  },
  {
    name: "Dr. Sneha Verma",
    email: "sneha.verma@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Pediatrician",
    experience: 10,
    location: { city: "Chennai", state: "Tamil Nadu" },
    availability: [
      { date: "2025-03-07", slots: ["11:30 AM", "3:00 PM", "6:00 PM"] },
    ],
  },
  {
    name: "Dr. Karthik Iyer",
    email: "karthik.iyer@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Neurologist",
    experience: 18,
    location: { city: "Hyderabad", state: "Telangana" },
    availability: [
      { date: "2025-03-07", slots: ["9:30 AM", "12:30 PM", "4:30 PM"] },
    ],
  },
  {
    name: "Dr. Alok Gupta",
    email: "alok.gupta@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Oncologist",
    experience: 20,
    location: { city: "Pune", state: "Maharashtra" },
    availability: [
      { date: "2025-03-07", slots: ["8:00 AM", "10:00 AM", "2:00 PM"] },
    ],
  },
  {
    name: "Dr. Meera Nair",
    email: "meera.nair@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Endocrinologist",
    experience: 9,
    location: { city: "Kolkata", state: "West Bengal" },
    availability: [
      { date: "2025-03-07", slots: ["9:00 AM", "11:30 AM", "5:30 PM"] },
    ],
  },
  {
    name: "Dr. Vikram Sethi",
    email: "vikram.sethi@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Psychiatrist",
    experience: 11,
    location: { city: "Ahmedabad", state: "Gujarat" },
    availability: [
      { date: "2025-03-07", slots: ["8:30 AM", "2:30 PM", "6:00 PM"] },
    ],
  },
  {
    name: "Dr. Anjali Bhatia",
    email: "anjali.bhatia@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Gastroenterologist",
    experience: 14,
    location: { city: "Jaipur", state: "Rajasthan" },
    availability: [
      { date: "2025-03-07", slots: ["10:00 AM", "12:00 PM", "3:30 PM"] },
    ],
  },
  {
    name: "Dr. Manish Dubey",
    email: "manish.dubey@example.com",
    password: "password123",
    role: "doctor",
    specialty: "Ophthalmologist",
    experience: 13,
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    availability: [
      { date: "2025-03-07", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] },
    ],
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();

    const createdDoctors = [];

    for (let doctor of doctors) {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(doctor.password, 10);

      // Create user entry
      const user = await User.create({
        name: doctor.name,
        email: doctor.email,
        password: hashedPassword,
        role: "doctor",
      });

      // Create doctor profile linked to the user
      const doctorProfile = await Doctor.create({
        user: user._id,
        specialty: doctor.specialty,
        experience: doctor.experience,
        location: doctor.location,
        availability: doctor.availability,
      });

      createdDoctors.push(doctorProfile);
    }

    console.log("Doctors Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

importData();
