// ========================================
// BACKEND LESSON 5: Updated Server with Routes
// ========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Routes
const { router: authRouter, authenticateToken } = require('./routes/auth');
const chatRouter = require('./routes/chat');
const admissionsRouter = require('./routes/admissions');
const academicRouter = require('./routes/academic');
const financialRouter = require('./routes/financial');
const campusRouter = require('./routes/campus');
const mentalHealthRouter = require('./routes/mentalHealth');
const careerRouter = require('./routes/career');

// Initialize Express App
const app = express();

// ========================================
// 🎯 SECURITY MIDDLEWARE
// ========================================

app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ========================================
// 🗄️ DATABASE CONNECTION
// ========================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ========================================
// 🚀 API ROUTES
// ========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/academic', academicRouter);
app.use('/api/financial', financialRouter);
app.use('/api/campus', campusRouter);
app.use('/api/mental-health', mentalHealthRouter);
app.use('/api/career', careerRouter);

// ========================================
// 🛡️ ERROR HANDLING
// ========================================

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication failed'
    });
  }
  
  // Duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'Resource already exists'
    });
  }
  
  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/profile',
      '/api/auth/logout',
      '/api/chat/send',
      '/api/chat/history',
      '/api/chat/analytics',
      '/api/chat/clear',
      '/api/admissions/apply',
      '/api/admissions/my',
      '/api/academic/registrations',
      '/api/financial/scholarships',
      '/api/financial/payment-plans',
      '/api/campus/hostel-applications',
      '/api/campus/map-requests',
      '/api/mental-health/appointments',
      '/api/mental-health/groups',
      '/api/mental-health/resources',
      '/api/career/resume-reviews',
      '/api/career/mock-interviews'
    ]
  });
});

// ========================================
// 🚀 SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️ Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/student-support'}`);
  console.log('');
  console.log('📚 Available API Endpoints:');
  console.log('  🏠 Authentication:');
  console.log('    POST /api/auth/register');
  console.log('    POST /api/auth/login');
  console.log('    GET  /api/auth/profile');
  console.log('    PUT  /api/auth/profile');
  console.log('    POST /api/auth/logout');
  console.log('');
  console.log('  💬 Chat System:');
  console.log('    POST /api/chat/send');
  console.log('    GET  /api/chat/history');
  console.log('    GET  /api/chat/analytics');
  console.log('    DELETE /api/chat/clear');
  console.log('');
  console.log('  🏥 Health Check:');
  console.log('    GET /api/health');
});

module.exports = app;
