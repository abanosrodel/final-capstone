const nodemailer = require('nodemailer');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your_email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your_app_password'
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTP = async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database - first check if columns exist, if not create them
    try {
      // Try to add the columns if they don't exist
      await new Promise((resolve, reject) => {
        db.query('ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE', (err, result) => {
          if (err && !err.message.includes('Duplicate column name')) reject(err);
          else resolve(result);
        });
      });
    } catch (e) {
      // Column might already exist, continue
    }

    try {
      await new Promise((resolve, reject) => {
        db.query('ALTER TABLE users ADD COLUMN otp_code VARCHAR(6) DEFAULT NULL', (err, result) => {
          if (err && !err.message.includes('Duplicate column name')) reject(err);
          else resolve(result);
        });
      });
    } catch (e) {
      // Column might already exist, continue
    }

    try {
      await new Promise((resolve, reject) => {
        db.query('ALTER TABLE users ADD COLUMN otp_expires DATETIME DEFAULT NULL', (err, result) => {
          if (err && !err.message.includes('Duplicate column name')) reject(err);
          else resolve(result);
        });
      });
    } catch (e) {
      // Column might already exist, continue
    }

    // Now insert the user with OTP
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (firstname, lastname, email, password, email_verified, otp_code, otp_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstname, lastname, email, '', false, otp, otpExpires],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Create transporter
    const transporter = createTransporter();

    // Email template
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'TATAK DECALIDAD - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">TATAK DECALIDAD</h1>
            <p style="color: #666; margin: 5px 0;">Tatak Pinoy - Represent culture with confidence</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; margin-bottom: 20px;">Hello ${firstname} ${lastname},</p>
            <p style="color: #666; margin-bottom: 30px;">Thank you for registering with TATAK DECALIDAD. Please use the verification code below to complete your registration:</p>
            
            <div style="background: #fff; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>📍 Cebu, Philippines | 📧 support@tatakdecalidad.ph</p>
            <p>&copy; 2025 TATAK DECALIDAD. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      
      res.json({ 
        message: 'OTP sent successfully',
        email: email,
        expiresIn: 600 // 10 minutes in seconds
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // If email fails, return the OTP in the response for testing
      res.json({ 
        message: 'OTP generated successfully (Email service not configured)',
        email: email,
        otp: otp, // Include OTP in response for testing
        expiresIn: 600,
        note: 'Please configure Gmail credentials in .env file for email delivery'
      });
    }

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP and complete registration
const verifyOTP = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Find user with this email and OTP
    const users = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expires > NOW()',
        [email, otp],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = users[0];

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password and mark as verified
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET password = ?, email_verified = TRUE, otp_code = NULL, otp_expires = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    res.json({ 
      message: 'Email verified successfully. You can now login.',
      email: email
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user with this email
    const users = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ? AND email_verified = FALSE', [email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (users.length === 0) {
      return res.status(400).json({ error: 'No pending verification found for this email' });
    }

    const user = users[0];

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update OTP in database
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET otp_code = ?, otp_expires = ? WHERE id = ?',
        [otp, otpExpires, user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Create transporter
    const transporter = createTransporter();

    // Email template
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'TATAK DECALIDAD - New Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">TATAK DECALIDAD</h1>
            <p style="color: #666; margin: 5px 0;">Tatak Pinoy - Represent culture with confidence</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">New Verification Code</h2>
            <p style="color: #666; margin-bottom: 20px;">Hello ${user.firstname} ${user.lastname},</p>
            <p style="color: #666; margin-bottom: 30px;">Here's your new verification code to complete your registration:</p>
            
            <div style="background: #fff; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>📍 Cebu, Philippines | 📧 support@tatakdecalidad.ph</p>
            <p>&copy; 2025 TATAK DECALIDAD. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      
      res.json({ 
        message: 'New OTP sent successfully',
        email: email,
        expiresIn: 600 // 10 minutes in seconds
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // If email fails, return the OTP in the response for testing
      res.json({ 
        message: 'New OTP generated successfully (Email service not configured)',
        email: email,
        otp: otp, // Include OTP in response for testing
        expiresIn: 600,
        note: 'Please configure Gmail credentials in .env file for email delivery'
      });
    }

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  resendOTP
};
