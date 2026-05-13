const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { sendRegistrationNotification } = require('../utils/notificationMailer');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  fullName: Joi.string().trim().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).allow('', null),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.details.map((detail) => detail.message).join(', '),
    });
  }

  req.body = value;
  return next();
};

// Generate access token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

const createSendTokens = async (user, res) => {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken = hashedRefreshToken;
  await user.save({ hooks: false });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

// POST - Register a new user
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists',
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      fullName,
      phoneNumber,
      role: 'student',
    });

    // Generate tokens and set refresh cookie
    const accessToken = await createSendTokens(user, res);

    try {
      await sendRegistrationNotification({ fullName, phoneNumber, email });
    } catch (mailError) {
      console.error(`Registration notification email failed: ${mailError.message}`);
    }

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
    });
  }
});

// POST - Login user
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated',
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
      });
    }

    // Generate tokens and set refresh cookie
    const accessToken = await createSendTokens(user, res);

    res.status(200).json({
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
});

// GET - Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: error.message,
    });
  }
});

// PUT - Update user profile
router.put('/profile', verifyToken, validate(updateProfileSchema), async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    await user.update({ fullName, phoneNumber });

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
});

// POST - Change password
router.post('/change-password', verifyToken, validate(changePasswordSchema), async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to change password',
      message: error.message,
    });
  }
});

// POST - Refresh access token using http-only refresh cookie
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Refresh token is required',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || !user.refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid refresh token',
      });
    }

    const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid refresh token',
      });
    }

    const accessToken = await createSendTokens(user, res);
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }
});

// POST - Logout and revoke refresh token
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user) {
      user.refreshToken = null;
      await user.save({ hooks: false });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      message: error.message,
    });
  }
});

// GET - Admin-only user list
router.get('/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve users',
      message: error.message,
    });
  }
});

module.exports = router;
