
const express = require('express');
const Joi = require('joi');
const db = require('../config/database');

const router = express.Router();

// Validation schema
const contactSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required()
});

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { fullName, email, subject, message } = req.body;

    await db.execute(
      'INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?, ?, ?, ?)',
      [fullName, email, subject, message]
    );

    res.status(201).json({ message: 'Contact message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
