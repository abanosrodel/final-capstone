// controllers/ForgotController.js
const ForgotModel = require('../models/ForgotModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const ForgotController = {
  sendResetLink: (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    ForgotModel.findUserByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000); // 1 hour

      ForgotModel.saveResetToken(email, token, expiry, (err2) => {
        if (err2) return res.status(500).json({ error: "Failed to save token" });

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });

        // Make the link point to your frontend, not backend
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
          `
        };

        transporter.sendMail(mailOptions, (err3) => {
          if (err3) return res.status(500).json({ error: "Failed to send email" });
          res.json({ message: "Reset link sent to your email" });
        });
      });
    });
  },

  resetPassword: (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    ForgotModel.findUserByToken(token, async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(400).json({ error: "Invalid or expired token" });

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        ForgotModel.updatePassword(results[0].id, hashedPassword, (err2) => {
          if (err2) return res.status(500).json({ error: "Failed to update password" });
          res.json({ message: "Password updated successfully" });
        });
      } catch (hashErr) {
        res.status(500).json({ error: "Error hashing password" });
      }
    });
  }
};

module.exports = ForgotController;
