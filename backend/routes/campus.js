const express = require('express');
const { CampusHostelApplication, CampusMapRequest } = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/hostel-applications', authenticateToken, async (req, res) => {
  try {
    const {
      hostelId,
      hostelName,
      fullName,
      studentId,
      email,
      phone,
      moveInDate,
      notes
    } = req.body;

    if (!hostelId || !hostelName || !fullName || !studentId || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['hostelId', 'hostelName', 'fullName', 'studentId', 'email']
      });
    }

    const application = new CampusHostelApplication({
      userId: req.userId,
      hostelId,
      hostelName,
      fullName,
      studentId,
      email,
      phone: phone || '',
      moveInDate: moveInDate || '',
      notes: notes || ''
    });

    await application.save();

    res.status(201).json({
      message: 'Hostel application submitted',
      application
    });
  } catch (error) {
    console.error('Hostel application error:', error);
    res.status(500).json({
      error: 'Failed to submit hostel application',
      message: 'Server error'
    });
  }
});

router.get('/hostel-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await CampusHostelApplication.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Hostel application list error:', error);
    res.status(500).json({
      error: 'Failed to fetch hostel applications',
      message: 'Server error'
    });
  }
});

router.post('/map-requests', authenticateToken, async (req, res) => {
  try {
    const { requestType, query, fromLocation, toLocation } = req.body;

    if (!requestType) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['requestType']
      });
    }

    const request = new CampusMapRequest({
      userId: req.userId,
      requestType,
      query: query || '',
      fromLocation: fromLocation || '',
      toLocation: toLocation || ''
    });

    await request.save();

    res.status(201).json({
      message: 'Map request submitted',
      request
    });
  } catch (error) {
    console.error('Map request error:', error);
    res.status(500).json({
      error: 'Failed to submit map request',
      message: 'Server error'
    });
  }
});

router.get('/map-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await CampusMapRequest.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Map request list error:', error);
    res.status(500).json({
      error: 'Failed to fetch map requests',
      message: 'Server error'
    });
  }
});

module.exports = router;
