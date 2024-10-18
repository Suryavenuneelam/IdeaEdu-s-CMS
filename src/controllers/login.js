const authService = require('../services/login');
const { User } = require('../models/userDetails');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'svenu612@gmail.com',
    pass: 'hmirrqwzjitiemdx',
  },
});

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { token, userId } = await authService.login(email, password);
    const user = await User.findById(userId);
    user.active = true;
    await user.save();
    res.json({
      token: token,
      userId: userId,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function refreshToken(req, res) {
  try {
    const { token } = req.body;
    const newToken = await authService.refreshToken(token);
    const user = await User.findById(req.user._id);
    user.active = false;
    await user.save();
    res.json({ newToken: newToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const mailOptions = {
      from: 'svenu612@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you have requested a password reset. 
      Please click on the following link to reset your password: 
      http://localhost:3000/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};