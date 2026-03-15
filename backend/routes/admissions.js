const express = require('express');
const { AdmissionApplication } = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const {
      programId,
      programName,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      previousEducation
    } = req.body;

    if (!programId || !programName || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['programId', 'programName', 'firstName', 'lastName', 'email', 'phone']
      });
    }

    const application = new AdmissionApplication({
      userId: req.userId,
      programId,
      programName,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: dateOfBirth || '',
      address: address || '',
      previousEducation: previousEducation || ''
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted',
      application
    });
  } catch (error) {
    console.error('Admission apply error:', error);
    res.status(500).json({
      error: 'Failed to submit application',
      message: 'Server error'
    });
  }
});

router.get('/my', authenticateToken, async (req, res) => {
  try {
    const applications = await AdmissionApplication.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Admission list error:', error);
    res.status(500).json({
      error: 'Failed to fetch applications',
      message: 'Server error'
    });
  }
});

module.exports = router;
