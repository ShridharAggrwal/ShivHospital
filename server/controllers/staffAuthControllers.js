const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv')
const path = require('path')
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');
dotenv.config({path : path.resolve(__dirname,'.../.env')})

const registerStaff = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new Staff({
      name,
      email,
      password: hashedPassword,
    });

    await staff.save();

    // JWT Token
    const token = jwt.sign(
      { id: staff._id, role: 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Staff registered successfully. Your account is pending approval.',
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      status: staff.status
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginStaff = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if the staff account is approved
      if (staff.status !== 'approved') {
        return res.status(403).json({
          message: 'Access denied',
          status: staff.status
        });
      }
  
      const token = jwt.sign(
        { id: staff._id, role: 'staff' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        status: staff.status
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Forgot Password - Send reset email
const forgotPasswordStaff = async (req, res) => {
  try {
    const { email } = req.body;

    // Find staff member by email
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: 'Staff with this email does not exist' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry on staff document
    staff.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    staff.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await staff.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/staff/${resetToken}`;

    // Send email using email service
    const emailSent = await sendPasswordResetEmail({
      email: staff.email,
      resetUrl,
      role: 'staff'
    });

    if (emailSent) {
      res.status(200).json({ message: 'Password reset email sent' });
    } else {
      staff.resetPasswordToken = null;
      staff.resetPasswordExpires = null;
      await staff.save();
      
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password with token
const resetPasswordStaff = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // Hash the token from the request
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find staff with valid token and unexpired
    const staff = await Staff.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!staff) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    staff.password = hashedPassword;
    staff.resetPasswordToken = null;
    staff.resetPasswordExpires = null;
    
    await staff.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    registerStaff,
    loginStaff,
    forgotPasswordStaff,
    resetPasswordStaff
  };
  