const express = require('express');
const router = express.Router();
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const Lead = require('../models/Lead');
const { sendLeadNotification } = require('../utils/notificationMailer');
const { appendLeadToSheet } = require('../utils/googleSheets');
const { verifyToken, isAdmin } = require('../middleware/auth');

const leadsCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Too many enquiries submitted from this IP. Please try again later.',
  },
});

const ALLOWED_COURSES = [
  'Mechanical CAD',
  'Civil Engineering',
  'IT & Software',
  'Interior Design',
  'Electrical CAD',
  'Digital Marketing',
  'Cyber Security',
  'AI & ML',
  'Data Science',
  'Cloud & DevOps',
];
const ALLOWED_STATUSES = ['New', 'Contacted', 'Interested', 'Enrolled', 'Not Interested'];

const createLeadSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().allow('', null),
  selectedCourse: Joi.string().valid(...ALLOWED_COURSES).required(),
});

const updateLeadSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
  email: Joi.string().email().allow('', null),
  selectedCourse: Joi.string().valid(...ALLOWED_COURSES),
  status: Joi.string().valid(...ALLOWED_STATUSES),
  notes: Joi.string().max(500).allow('', null),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.details.map((d) => d.message).join(', '),
    });
  }
  req.body = value;
  return next();
};

// POST - Create a new lead (public - from website inquiry form)
router.post('/', leadsCreateLimiter, validate(createLeadSchema), async (req, res) => {
  try {
    const { fullName, phoneNumber, email, selectedCourse } = req.body;
    const lead = await Lead.create({ fullName, phoneNumber, email, selectedCourse });

    try {
      await sendLeadNotification({ fullName, phoneNumber, email, selectedCourse });
    } catch (mailError) {
      console.error(`Lead notification email failed: ${mailError.message}`);
    }

    // Sync to Google Sheets (non-blocking — failure won't affect the response)
    appendLeadToSheet(lead.toJSON()).catch((err) =>
      console.error(`Google Sheets async error: ${err.message}`)
    );

    res.status(201).json({ message: 'Lead created successfully', data: lead });
  } catch (error) {
    res.status(500).json({ error: 'Error creating lead', message: error.message });
  }
});

// GET - Retrieve all leads (paginated)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const { count, rows } = await Lead.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.status(200).json({
      count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving leads', message: error.message });
  }
});

// GET - Retrieve a single lead by ID
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.status(200).json({ data: lead });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving lead',
      message: error.message,
    });
  }
});

// PUT - Update a lead by ID
router.put('/:id', verifyToken, isAdmin, validate(updateLeadSchema), async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const { fullName, phoneNumber, email, selectedCourse, status, notes } = req.body;
    await lead.update({ fullName, phoneNumber, email, selectedCourse, status, notes });
    res.status(200).json({ message: 'Lead updated successfully', data: lead });
  } catch (error) {
    res.status(500).json({ error: 'Error updating lead', message: error.message });
  }
});

// DELETE - Delete a lead by ID
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    await lead.destroy();
    res.status(200).json({
      message: 'Lead deleted successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting lead',
      message: error.message,
    });
  }
});

// GET - Get leads by status
router.get('/filter/status/:status', verifyToken, isAdmin, async (req, res) => {
  try {
    const leads = await Lead.findAll({
      where: { status: req.params.status },
    });
    res.status(200).json({
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving leads by status',
      message: error.message,
    });
  }
});

// GET - Get leads by course
router.get('/filter/course/:course', verifyToken, isAdmin, async (req, res) => {
  try {
    const leads = await Lead.findAll({
      where: { selectedCourse: req.params.course },
    });
    res.status(200).json({
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving leads by course',
      message: error.message,
    });
  }
});

module.exports = router;
