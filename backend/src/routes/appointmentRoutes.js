const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('patient'), createAppointment);
router.get('/', getAppointments);
router.patch('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;
