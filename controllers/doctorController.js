import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

// @desc    Search doctors by name, specialty, or location
// @route   GET /api/doctors/search
// @access  Public
export const searchDoctors = async (req, res) => {
  try {
    let { name, specialty, city, state } = req.query;

    let filter = {};

    // Apply filters based on query parameters
    if (specialty) {
      filter.specialty = { $regex: specialty, $options: "i" };
    }
    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }
    if (state) {
      filter["location.state"] = { $regex: state, $options: "i" };
    }

    let doctors;

    // If searching by name, we need to find the user first
    if (name) {
      const users = await User.find({
        name: { $regex: name, $options: "i" },
      }).select("_id");
      const userIds = users.map((user) => user._id);

      // Add filter to match doctor users
      filter.user = { $in: userIds };
    }

    doctors = await Doctor.find(filter).populate("user", "name email");

    res
      .status(200)
      .json({ success: true, results: doctors.length, data: doctors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// for updating availability
export const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const { availability } = req.body;

    doctor.availability = availability; // Update availability slots
    await doctor.save();

    res
      .status(200)
      .json({ message: "Availability updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get a doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate(
      "user",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
