// ========================================
// BACKEND LESSON 3: Authentication Routes
// ========================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();

// ========================================
// 🔐 HELPER FUNCTIONS
// ========================================

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid token' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired' 
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('role isActive');

    if (!user || !user.isActive) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Account inactive'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      error: 'Authorization failed',
      message: 'Server error'
    });
  }
};

// ========================================
// 📝 VALIDATION MIDDLEWARE
// ========================================

const validateRegistration = (req, res, next) => {
  const { firstName, lastName, password, studentId } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !password || !studentId) {
    return res.status(400).json({
      error: 'All fields are required',
      fields: ['firstName', 'lastName', 'password', 'studentId']
    });
  }
  
  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters'
    });
  }
  
  next();
};

// ========================================
// 🚀 ROUTES
// ========================================

// POST /api/auth/register
// Register new student account
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { firstName, lastName, password, studentId, program } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      studentId
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Student ID already registered'
      });
    }
    
    // Hash password (NEVER store plain passwords)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      studentId,
      program: program || 'Computer Science',
      year: 1,
      gpa: 0.0
    });
    
    await newUser.save();
    
    // Generate token for immediate login
    const token = generateToken(newUser._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        studentId: newUser.studentId,
        program: newUser.program
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Server error during registration'
    });
  }
});

// POST /api/auth/login
// Authenticate existing user
router.post('/login', async (req, res) => {
  try {
    const { studentId, adminId, password, role } = req.body;

    const loginId = role === 'admin' ? adminId : studentId;

    console.log('[auth/login] role:', role, 'adminId:', adminId, 'studentId:', studentId);

    if (!loginId) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Login ID is required'
      });
    }
    
    // Find user by studentId
    const user = await User.findOne(
      role === 'admin'
        ? { adminId: loginId }
        : { studentId: loginId }
    );

    console.log('[auth/login] user found:', Boolean(user));
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Student not found'
      });
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Incorrect password'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account deactivated',
        message: 'Please contact support'
      });
    }

    // Role check for admin logins
    if (role && user.role !== role) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Role mismatch for this account'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        program: user.program,
        year: user.year,
        gpa: user.gpa,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Server error during login'
    });
  }
});

// GET /api/auth/profile
// Get authenticated user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        program: user.program,
        year: user.year,
        gpa: user.gpa,
        language: user.language,
        theme: user.theme,
        socialProfiles: user.socialProfiles,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: 'Server error'
    });
  }
});

// PUT /api/auth/profile
// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'language', 'theme', 'socialProfiles'];
    
    // Filter only allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...filteredUpdates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        program: user.program,
        year: user.year,
        gpa: user.gpa,
        language: user.language,
        theme: user.theme,
        socialProfiles: user.socialProfiles
      }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Server error'
    });
  }
});

// POST /api/auth/logout
// Logout user (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  // In a real app, you might:
  // 1. Add token to blacklist
  // 2. Log logout activity
  // 3. Clear refresh tokens
  
  res.json({
    message: 'Logout successful',
    timestamp: new Date().toISOString()
  });
});

module.exports = { router, authenticateToken, requireAdmin };
