const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc  Register user
// @route POST /api/auth/signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    // Send verification email (non-blocking)
    try {
      const verifyToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });
      const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Verify your email – MERN Auth',
        html: `<p>Hi ${user.name}, click <a href="${verifyUrl}">here</a> to verify your email. Link expires in 24 hours.</p>`,
      });
    } catch {
      // Email failure should not block signup
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      bio: req.user.bio,
      isEmailVerified: req.user.isEmailVerified,
      createdAt: req.user.createdAt,
    },
  });
};

// @desc  Forgot password – send reset email
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 to prevent email enumeration
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset – MERN Auth',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
      });
      res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      next(new Error('Email could not be sent'));
    }
  } catch (err) {
    next(err);
  }
};

// @desc  Reset password
// @route PUT /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

// @desc  Verify email
// @route GET /api/auth/verify-email/:token
const verifyEmail = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, forgotPassword, resetPassword, verifyEmail };
