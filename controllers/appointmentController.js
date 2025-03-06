import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import sendEmail from "../utils/sendEmail.js";

import { sendBookingConfirmation } from "../utils/emailService.js";

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private (Patients Only)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user._id;

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId).populate("user");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the selected slot is available
    const isSlotAvailable = doctor.availability.some(
      (slot) => slot.date === date && slot.slots.includes(time)
    );

    if (!isSlotAvailable) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available" });
    }

    // Prevent double booking (Concurrency Handling)
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
      status: "booked",
    });

    const bookingDetails = {
      userName: req.user.name,
      doctorName: doctor.user.name,
      specialty: doctor.specialty,
      date,
      time,
      location: `${doctor.location.city}, ${doctor.location.state}`,
    };
    console.log(bookingDetails.doctorName);

    // Send Email Notification
    await sendBookingConfirmation(req.user.email, bookingDetails);

    res
      .status(201)
      .json({ message: "Appointment booked successfully!", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Cancel an appointment
// @route   POST /api/appointments/cancel
// @access  Private (Patients Only)
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const patientId = req.user._id;

    // Find appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patientId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized" });
    }

    // Update status to cancelled
    appointment.status = "cancelled";
    await appointment.save();

    // Send Email Notification
    await sendEmail(
      req.user.email,
      "Appointment Cancelled",
      `Your appointment with Dr. ${appointment.doctor} on ${appointment.date} at ${appointment.time} has been cancelled.`
    );

    res.status(200).json({ message: "Appointment cancelled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctors Only)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
    }).populate("patient", "name email");

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// for patients to get their appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    }).populate({
      path: "doctor",
      populate: { path: "user", select: "name email" }, // Get doctor's user details
    });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};
