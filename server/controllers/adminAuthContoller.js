const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const dotenv = require('dotenv')
const path = require('path')
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');
dotenv.config({path : path.resolve(__dirname,'.../.env')})
//login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      admin: {
        name: admin.name,
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password - Send reset email
const forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin with this email does not exist' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry on admin document
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await admin.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/admin/${resetToken}`;

    // Send email using email service
    const emailSent = await sendPasswordResetEmail({
      email: admin.email,
      resetUrl,
      role: 'admin'
    });

    if (emailSent) {
      res.status(200).json({ message: 'Password reset email sent' });
    } else {
      admin.resetPasswordToken = null;
      admin.resetPasswordExpires = null;
      await admin.save();
      
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password with token
const resetPasswordAdmin = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // Hash the token from the request
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find admin with valid token and unexpired
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    admin.password = hashedPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;
    
    await admin.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  loginAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin
};
