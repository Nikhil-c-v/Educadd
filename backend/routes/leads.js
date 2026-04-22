const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST - Create a new lead (from website form)
router.post('/', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, selectedCourse } = req.body;

    if (!fullName || !phoneNumber || !selectedCourse) {
      return res.status(400).json({
        error: 'Please provide fullName, phoneNumber, and selectedCourse',
      });
    }

    const lead = await Lead.create({
      fullName,
      phoneNumber,
      email,
      selectedCourse,
    });

    res.status(201).json({
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating lead',
      message: error.message,
    });
  }
});

// GET - Retrieve all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving leads',
      message: error.message,
    });
  }
});

// GET - Retrieve a single lead by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    await lead.update(req.body);
    res.status(200).json({
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating lead',
      message: error.message,
    });
  }
});

// DELETE - Delete a lead by ID
router.delete('/:id', async (req, res) => {
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
router.get('/filter/status/:status', async (req, res) => {
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
router.get('/filter/course/:course', async (req, res) => {
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
