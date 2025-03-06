import nodemailer from "nodemailer";

export const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  try {
    // Configure the transporter (use Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Appointment Confirmation",
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${bookingDetails.userName},</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${bookingDetails.doctorName}</li>
          <li><strong>Specialty:</strong> ${bookingDetails.specialty}</li>
          <li><strong>Date:</strong> ${bookingDetails.date}</li>
          <li><strong>Time:</strong> ${bookingDetails.time}</li>
          <li><strong>Location:</strong> ${bookingDetails.location}</li>
        </ul>
        <p>Thank you for using our service!</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// module.exports = { sendBookingConfirmation };
