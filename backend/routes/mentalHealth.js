const express = require('express');
const {
  MentalHealthAppointment,
  MentalHealthGroupJoin,
  MentalHealthResourceAccess
} = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const {
      counselorId,
      counselorName,
      fullName,
      email,
      phone,
      preferredDate,
      concerns
    } = req.body;

    if (!counselorId || !counselorName || !fullName || !email || !preferredDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['counselorId', 'counselorName', 'fullName', 'email', 'preferredDate']
      });
    }

    const appointment = new MentalHealthAppointment({
      userId: req.userId,
      counselorId,
      counselorName,
      fullName,
      email,
      phone: phone || '',
      preferredDate,
      concerns: concerns || ''
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment request submitted',
      appointment
    });
  } catch (error) {
    console.error('Mental health appointment error:', error);
    res.status(500).json({
      error: 'Failed to submit appointment',
      message: 'Server error'
    });
  }
});

router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await MentalHealthAppointment.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Mental health appointment list error:', error);
    res.status(500).json({
      error: 'Failed to fetch appointments',
      message: 'Server error'
    });
  }
});

router.post('/groups', authenticateToken, async (req, res) => {
  try {
    const { groupId, groupName, fullName, email, notes } = req.body;

    if (!groupId || !groupName || !fullName || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['groupId', 'groupName', 'fullName', 'email']
      });
    }

    const joinRequest = new MentalHealthGroupJoin({
      userId: req.userId,
      groupId,
      groupName,
      fullName,
      email,
      notes: notes || ''
    });

    await joinRequest.save();

    res.status(201).json({
      message: 'Group join request submitted',
      joinRequest
    });
  } catch (error) {
    console.error('Mental health group error:', error);
    res.status(500).json({
      error: 'Failed to submit group request',
      message: 'Server error'
    });
  }
});

router.get('/groups', authenticateToken, async (req, res) => {
  try {
    const joins = await MentalHealthGroupJoin.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ joins });
  } catch (error) {
    console.error('Mental health group list error:', error);
    res.status(500).json({
      error: 'Failed to fetch group requests',
      message: 'Server error'
    });
  }
});

router.post('/resources', authenticateToken, async (req, res) => {
  try {
    const { resourceId, resourceTitle, fullName, email } = req.body;

    if (!resourceId || !resourceTitle || !fullName || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['resourceId', 'resourceTitle', 'fullName', 'email']
      });
    }

    const accessRequest = new MentalHealthResourceAccess({
      userId: req.userId,
      resourceId,
      resourceTitle,
      fullName,
      email
    });

    await accessRequest.save();

    res.status(201).json({
      message: 'Resource access submitted',
      accessRequest
    });
  } catch (error) {
    console.error('Mental health resource error:', error);
    res.status(500).json({
      error: 'Failed to submit resource request',
      message: 'Server error'
    });
  }
});

router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const requests = await MentalHealthResourceAccess.find({ userId: req.userId })
      .sort({ submittedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Mental health resource list error:', error);
    res.status(500).json({
      error: 'Failed to fetch resource requests',
      message: 'Server error'
    });
  }
});

module.exports = router;
