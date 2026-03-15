const express = require('express');
const {
  FinancialScholarshipApplication,
  FinancialPaymentPlanRequest
} = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/scholarships', authenticateToken, async (req, res) => {
  try {
    const {
      scholarshipId,
      scholarshipName,
      fullName,
      email,
      phone,
      studentId,
      financialNeed,
      gpa,
      essay
    } = req.body;

    if (!scholarshipId || !scholarshipName || !fullName || !email || !studentId) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['scholarshipId', 'scholarshipName', 'fullName', 'email', 'studentId']
      });
    }

    const application = new FinancialScholarshipApplication({
      userId: req.userId,
      scholarshipId,
      scholarshipName,
      fullName,
      email,
      phone: phone || '',
      studentId,
      financialNeed: financialNeed || '',
      gpa: gpa || '',
      essay: essay || ''
    });

    await application.save();

    res.status(201).json({
      message: 'Scholarship application submitted',
      application
    });
  } catch (error) {
    console.error('Financial scholarship error:', error);
    res.status(500).json({
      error: 'Failed to submit scholarship application',
      message: 'Server error'
    });
  }
});

router.get('/scholarships', authenticateToken, async (req, res) => {
  try {
    const applications = await FinancialScholarshipApplication.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Financial scholarship list error:', error);
    res.status(500).json({
      error: 'Failed to fetch scholarship applications',
      message: 'Server error'
    });
  }
});

router.post('/payment-plans', authenticateToken, async (req, res) => {
  try {
    const { planId, planName, fullName, studentId, email, paymentMethod } = req.body;

    if (!planId || !planName || !fullName || !studentId || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['planId', 'planName', 'fullName', 'studentId', 'email']
      });
    }

    const request = new FinancialPaymentPlanRequest({
      userId: req.userId,
      planId,
      planName,
      fullName,
      studentId,
      email,
      paymentMethod: paymentMethod || ''
    });

    await request.save();

    res.status(201).json({
      message: 'Payment plan request submitted',
      request
    });
  } catch (error) {
    console.error('Payment plan error:', error);
    res.status(500).json({
      error: 'Failed to submit payment plan request',
      message: 'Server error'
    });
  }
});

router.get('/payment-plans', authenticateToken, async (req, res) => {
  try {
    const requests = await FinancialPaymentPlanRequest.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Payment plan list error:', error);
    res.status(500).json({
      error: 'Failed to fetch payment plan requests',
      message: 'Server error'
    });
  }
});

module.exports = router;
