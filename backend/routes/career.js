const express = require('express');
const {
  CareerResumeReviewRequest,
  CareerMockInterviewRequest
} = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/resume-reviews', authenticateToken, async (req, res) => {
  try {
    const {
      resumeTitle,
      targetRole,
      resumeLink,
      fullName,
      studentId,
      email,
      notes
    } = req.body;

    if (!resumeTitle || !targetRole || !fullName || !studentId || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['resumeTitle', 'targetRole', 'fullName', 'studentId', 'email']
      });
    }

    const request = new CareerResumeReviewRequest({
      userId: req.userId,
      resumeTitle,
      targetRole,
      resumeLink: resumeLink || '',
      fullName,
      studentId,
      email,
      notes: notes || ''
    });

    await request.save();

    res.status(201).json({
      message: 'Resume review request submitted',
      request
    });
  } catch (error) {
    console.error('Career resume review error:', error);
    res.status(500).json({
      error: 'Failed to submit resume review request',
      message: 'Server error'
    });
  }
});

router.get('/resume-reviews', authenticateToken, async (req, res) => {
  try {
    const requests = await CareerResumeReviewRequest.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Career resume review list error:', error);
    res.status(500).json({
      error: 'Failed to fetch resume review requests',
      message: 'Server error'
    });
  }
});

router.post('/mock-interviews', authenticateToken, async (req, res) => {
  try {
    const {
      role,
      preferredDate,
      experienceLevel,
      fullName,
      studentId,
      email,
      notes
    } = req.body;

    if (!role || !preferredDate || !fullName || !studentId || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['role', 'preferredDate', 'fullName', 'studentId', 'email']
      });
    }

    const request = new CareerMockInterviewRequest({
      userId: req.userId,
      role,
      preferredDate,
      experienceLevel: experienceLevel || 'intermediate',
      fullName,
      studentId,
      email,
      notes: notes || ''
    });

    await request.save();

    res.status(201).json({
      message: 'Mock interview request submitted',
      request
    });
  } catch (error) {
    console.error('Career mock interview error:', error);
    res.status(500).json({
      error: 'Failed to submit mock interview request',
      message: 'Server error'
    });
  }
});

router.get('/mock-interviews', authenticateToken, async (req, res) => {
  try {
    const requests = await CareerMockInterviewRequest.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Career mock interview list error:', error);
    res.status(500).json({
      error: 'Failed to fetch mock interview requests',
      message: 'Server error'
    });
  }
});

module.exports = router;
