const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { serviceId, userId, name, email, date, time, message } = req.body;

    // If serviceId is provided, validate that the service exists
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }

    // Create new appointment
    const appointment = new Appointment({
      serviceId,
      bookingType: serviceId ? 'service' : 'general',
      userId,
      name,
      email,
      date,
      time,
      message
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

// Get appointments for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ serviceId: req.params.serviceId })
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Get appointments for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId })
      .populate('serviceId')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Update appointment status
router.patch('/:appointmentId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});

module.exports = router; 