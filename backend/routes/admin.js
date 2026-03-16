const express = require('express');
const {
  Module,
  User,
  AdmissionApplication,
  AcademicRegistration,
  FinancialScholarshipApplication,
  FinancialPaymentPlanRequest,
  CampusHostelApplication,
  CampusMapRequest,
  MentalHealthAppointment,
  MentalHealthGroupJoin,
  MentalHealthResourceAccess,
  CareerResumeReviewRequest,
  CareerMockInterviewRequest
} = require('../models/User');
const { authenticateToken, requireAdmin } = require('./auth');

const router = express.Router();

const DEFAULT_MODULES = [
  {
    moduleId: 'admission',
    title: 'Admissions',
    description: 'Approve applications, update program info, and review eligibility data.'
  },
  {
    moduleId: 'academic',
    title: 'Academics',
    description: 'Manage course registrations, calendars, and academic resources.'
  },
  {
    moduleId: 'financial',
    title: 'Financial Aid',
    description: 'Control scholarships, payment plans, and student financial requests.'
  },
  {
    moduleId: 'campus',
    title: 'Campus Services',
    description: 'Oversee hostel applications, transport updates, and campus requests.'
  },
  {
    moduleId: 'mental-health',
    title: 'Wellbeing',
    description: 'Coordinate counseling requests and resource access approvals.'
  },
  {
    moduleId: 'career',
    title: 'Career Support',
    description: 'Track resume reviews, mock interviews, and internship pipelines.'
  },
  {
    moduleId: 'social-media',
    title: 'Social Media',
    description: 'Schedule announcements and moderate student-facing posts.'
  },
  {
    moduleId: 'ai-faqs',
    title: 'AI FAQs',
    description: 'Curate AI-generated FAQs and publish verified answers.'
  }
];

const ensureDefaultModules = async () => {
  await Promise.all(
    DEFAULT_MODULES.map((module) =>
      Module.updateOne(
        { moduleId: module.moduleId },
        {
          $setOnInsert: {
            ...module,
            isActive: true,
            visibility: 'both',
            announcements: [],
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
    )
  );
};

const buildStatusFilter = (statusParam, pendingStatuses) => {
  if (!statusParam || statusParam === 'all') {
    return {};
  }

  if (statusParam === 'pending') {
    return { status: { $in: pendingStatuses } };
  }

  return { status: statusParam };
};

const getModuleSources = (moduleId) => {
  switch (moduleId) {
    case 'admission':
      return [
        {
          collection: 'admission',
          model: AdmissionApplication,
          pendingStatuses: ['submitted', 'under-review'],
          map: (item) => ({
            title: item.programName,
            subtitle: `${item.firstName} ${item.lastName}`,
            details: {
              email: item.email,
              phone: item.phone
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    case 'academic':
      return [
        {
          collection: 'academic',
          model: AcademicRegistration,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: `${item.courseCode} - ${item.courseName}`,
            subtitle: item.fullName,
            details: {
              studentId: item.studentId,
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    case 'financial':
      return [
        {
          collection: 'financial-scholarship',
          model: FinancialScholarshipApplication,
          pendingStatuses: ['submitted', 'reviewing'],
          map: (item) => ({
            title: item.scholarshipName,
            subtitle: item.fullName,
            details: {
              studentId: item.studentId,
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        },
        {
          collection: 'financial-payment',
          model: FinancialPaymentPlanRequest,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: item.planName,
            subtitle: item.fullName,
            details: {
              studentId: item.studentId,
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    case 'campus':
      return [
        {
          collection: 'campus-hostel',
          model: CampusHostelApplication,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: item.hostelName,
            subtitle: item.fullName,
            details: {
              studentId: item.studentId,
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        },
        {
          collection: 'campus-map',
          model: CampusMapRequest,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: `Map: ${item.requestType}`,
            subtitle: item.query || `${item.fromLocation || ''} ${item.toLocation || ''}`.trim(),
            details: {
              fromLocation: item.fromLocation,
              toLocation: item.toLocation
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    case 'mental-health':
      return [
        {
          collection: 'mental-appointment',
          model: MentalHealthAppointment,
          pendingStatuses: ['submitted', 'scheduled'],
          map: (item) => ({
            title: item.counselorName,
            subtitle: item.fullName,
            details: {
              email: item.email,
              preferredDate: item.preferredDate
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        },
        {
          collection: 'mental-group',
          model: MentalHealthGroupJoin,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: item.groupName,
            subtitle: item.fullName,
            details: {
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        },
        {
          collection: 'mental-resource',
          model: MentalHealthResourceAccess,
          pendingStatuses: ['submitted'],
          map: (item) => ({
            title: item.resourceTitle,
            subtitle: item.fullName,
            details: {
              email: item.email
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    case 'career':
      return [
        {
          collection: 'career-resume',
          model: CareerResumeReviewRequest,
          pendingStatuses: ['submitted', 'reviewing'],
          map: (item) => ({
            title: item.resumeTitle,
            subtitle: item.fullName,
            details: {
              email: item.email,
              targetRole: item.targetRole
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        },
        {
          collection: 'career-mock',
          model: CareerMockInterviewRequest,
          pendingStatuses: ['submitted', 'scheduled'],
          map: (item) => ({
            title: item.role,
            subtitle: item.fullName,
            details: {
              email: item.email,
              preferredDate: item.preferredDate
            },
            status: item.status,
            submittedAt: item.submittedAt
          })
        }
      ];
    default:
      return [];
  }
};

const getModelForCollection = (collection) => {
  switch (collection) {
    case 'admission':
      return AdmissionApplication;
    case 'academic':
      return AcademicRegistration;
    case 'financial-scholarship':
      return FinancialScholarshipApplication;
    case 'financial-payment':
      return FinancialPaymentPlanRequest;
    case 'campus-hostel':
      return CampusHostelApplication;
    case 'campus-map':
      return CampusMapRequest;
    case 'mental-appointment':
      return MentalHealthAppointment;
    case 'mental-group':
      return MentalHealthGroupJoin;
    case 'mental-resource':
      return MentalHealthResourceAccess;
    case 'career-resume':
      return CareerResumeReviewRequest;
    case 'career-mock':
      return CareerMockInterviewRequest;
    default:
      return null;
  }
};

router.get('/modules', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await ensureDefaultModules();
    const modules = await Module.find().sort({ title: 1 });
    res.json({ modules });
  } catch (error) {
    console.error('Admin modules list error:', error);
    res.status(500).json({
      error: 'Failed to fetch modules',
      message: 'Server error'
    });
  }
});

router.get('/modules/:moduleId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await ensureDefaultModules();
    const module = await Module.findOne({ moduleId: req.params.moduleId });

    if (!module) {
      return res.status(404).json({
        error: 'Module not found'
      });
    }

    res.json({ module });
  } catch (error) {
    console.error('Admin module fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch module',
      message: 'Server error'
    });
  }
});

router.post('/modules', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { moduleId, title, description, isActive, visibility } = req.body;

    if (!moduleId || !title || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['moduleId', 'title', 'description']
      });
    }

    const module = await Module.create({
      moduleId,
      title,
      description,
      isActive: isActive !== undefined ? isActive : true,
      visibility: visibility || 'both',
      announcements: [],
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Module created',
      module
    });
  } catch (error) {
    console.error('Admin module create error:', error);
    res.status(500).json({
      error: 'Failed to create module',
      message: 'Server error'
    });
  }
});

router.put('/modules/:moduleId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const allowed = ['title', 'description', 'isActive', 'visibility'];
    const payload = {};

    allowed.forEach((key) => {
      if (updates[key] !== undefined) {
        payload[key] = updates[key];
      }
    });

    payload.updatedAt = new Date();

    const module = await Module.findOneAndUpdate(
      { moduleId: req.params.moduleId },
      payload,
      { new: true }
    );

    if (!module) {
      return res.status(404).json({
        error: 'Module not found'
      });
    }

    res.json({
      message: 'Module updated',
      module
    });
  } catch (error) {
    console.error('Admin module update error:', error);
    res.status(500).json({
      error: 'Failed to update module',
      message: 'Server error'
    });
  }
});

router.post('/modules/:moduleId/announcements', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: ['title', 'message']
      });
    }

    const module = await Module.findOneAndUpdate(
      { moduleId: req.params.moduleId },
      {
        $push: {
          announcements: {
            title,
            message,
            createdAt: new Date(),
            createdBy: req.user._id
          }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!module) {
      return res.status(404).json({
        error: 'Module not found'
      });
    }

    res.status(201).json({
      message: 'Announcement published',
      module
    });
  } catch (error) {
    console.error('Admin announcement error:', error);
    res.status(500).json({
      error: 'Failed to publish announcement',
      message: 'Server error'
    });
  }
});

router.get('/requests/:moduleId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const statusParam = String(req.query.status || 'pending');
    const sources = getModuleSources(moduleId);

    if (!sources.length) {
      return res.json({ requests: [] });
    }

    const requests = [];

    for (const source of sources) {
      const filter = buildStatusFilter(statusParam, source.pendingStatuses);
      const items = await source.model.find(filter).sort({ submittedAt: -1 });
      items.forEach((item) => {
        requests.push({
          id: item._id,
          collection: source.collection,
          ...source.map(item)
        });
      });
    }

    res.json({
      requests: requests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    });
  } catch (error) {
    console.error('Admin requests error:', error);
    res.status(500).json({
      error: 'Failed to fetch requests',
      message: 'Server error'
    });
  }
});

router.patch('/requests/:moduleId/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { collection, status } = req.body;
    const model = getModelForCollection(collection);

    if (!model) {
      return res.status(400).json({
        error: 'Invalid request type'
      });
    }

    const updated = await model.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Request not found'
      });
    }

    res.json({
      message: 'Request updated',
      request: updated
    });
  } catch (error) {
    console.error('Admin request update error:', error);
    res.status(500).json({
      error: 'Failed to update request',
      message: 'Server error'
    });
  }
});

router.get('/students', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const status = String(req.query.status || 'active');
    const filter = { role: 'student' };
    if (status === 'active') {
      filter.isActive = true;
    }
    if (status === 'inactive') {
      filter.isActive = false;
    }

    const students = await User.find(filter)
      .select('firstName lastName studentId program year gpa isActive lastLogin')
      .sort({ lastLogin: -1 });

    res.json({ students });
  } catch (error) {
    console.error('Admin students error:', error);
    res.status(500).json({
      error: 'Failed to fetch students',
      message: 'Server error'
    });
  }
});

router.patch('/students/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    ).select('firstName lastName studentId isActive');

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json({
      message: 'Student updated',
      student
    });
  } catch (error) {
    console.error('Admin student update error:', error);
    res.status(500).json({
      error: 'Failed to update student',
      message: 'Server error'
    });
  }
});

module.exports = router;
