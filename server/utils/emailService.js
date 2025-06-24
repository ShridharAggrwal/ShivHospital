const nodemailer = require('nodemailer');

/**
 * Creates a nodemailer transporter using environment variables
 * @returns {object} - Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Sends a password reset email
 * @param {object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.resetUrl - Password reset URL
 * @param {string} options.role - User role (admin or staff)
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async ({ email, resetUrl, role }) => {
  try {
    const transporter = createTransporter();
    
    // Create email message
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d6efd;">Password Reset Request</h2>
        <p>You requested a password reset for your ${role} account at Patient Registration System.</p>
        <p>Please click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a 
            href="${resetUrl}" 
            style="background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            clicktracking="off"
          >
            Reset Password
          </a>
        </p>
        <p>Alternatively, you can copy and paste this link in your browser:</p>
        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
          ${resetUrl}
        </p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #6c757d; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Patient Registration" <noreply@patientregistration.com>',
      to: email,
      subject: 'Password Reset Request',
      html: message,
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
}; 