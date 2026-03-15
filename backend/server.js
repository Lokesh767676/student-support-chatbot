// ========================================
// BACKEND LESSON 1: Main Server Setup
// ========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Routes for Data Storage
const { router: authRouter, authenticateToken } = require('./routes/auth');
const chatRouter = require('./routes/chat');
const admissionsRouter = require('./routes/admissions');
const academicRouter = require('./routes/academic');
const financialRouter = require('./routes/financial');
const campusRouter = require('./routes/campus');
const mentalHealthRouter = require('./routes/mentalHealth');

// Initialize Express App
const app = express();

// ========================================
// 🎯 SECURITY MIDDLEWARE
// ========================================

// Helmet: Security Headers
// Protects against common web vulnerabilities
app.use(helmet());

// CORS: Cross-Origin Resource Sharing
// Allows frontend (React app) to communicate with backend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate Limiting: Prevent API Abuse
// Limits requests per IP to prevent spam/attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body Parsing: Handle JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ========================================
// 🗄️ DATABASE CONNECTION
// ========================================

// MongoDB Connection using Mongoose
// Mongoose provides schema validation, middleware, etc.
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
// 🚀 SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ========================================
// 📝 BASIC ROUTE TESTING
// ========================================

// API Routes for Data Storage
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/academic', academicRouter);
app.use('/api/financial', financialRouter);
app.use('/api/campus', campusRouter);
app.use('/api/mental-health', mentalHealthRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = app;
