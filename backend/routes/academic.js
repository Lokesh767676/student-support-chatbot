const express = require('express');
const { AcademicRegistration } = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/registrations', authenticateToken, async (req, res) => {
  try {
    const { courseId, courseCode, courseName, fullName, studentId, email, notes } = req.body;

    if (!courseId || !courseCode || !courseName || !fullName || !studentId || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['courseId', 'courseCode', 'courseName', 'fullName', 'studentId', 'email']
      });
    }

    const registration = new AcademicRegistration({
      userId: req.userId,
      courseId,
      courseCode,
      courseName,
      fullName,
      studentId,
      email,
      notes: notes || ''
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration submitted',
      registration
    });
  } catch (error) {
    console.error('Academic registration error:', error);
    res.status(500).json({
      error: 'Failed to submit registration',
      message: 'Server error'
    });
  }
});

router.get('/registrations', authenticateToken, async (req, res) => {
  try {
    const registrations = await AcademicRegistration.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error('Academic registration list error:', error);
    res.status(500).json({
      error: 'Failed to fetch registrations',
      message: 'Server error'
    });
  }
});

module.exports = router;
