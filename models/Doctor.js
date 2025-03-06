import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    availability: [
      {
        date: { type: String, required: true }, // "YYYY-MM-DD"
        slots: [{ type: String }], // ["10:00 AM", "11:00 AM"]
      },
    ],
  },
  { timestamps: true }
);

// add indexes for faster searches
doctorSchema.index({
  "user.name": 1,
  specialty: 1,
  "location.city": 1,
  "location.state": 1,
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
