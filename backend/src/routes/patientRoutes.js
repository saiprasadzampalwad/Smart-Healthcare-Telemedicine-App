const express = require('express');
const router = express.Router();
const { getPatientProfile, updatePatientProfile, getMedicalHistory } = require('../controllers/patientController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET api/patients/profile
// @desc    Get current patient profile
// @access  Private (patient)
router.get('/profile', protect, authorize('patient'), getPatientProfile);

// @route   PUT api/patients/profile  
// @desc    Update patient profile
// @access  Private (patient)
router.put('/profile', protect, authorize('patient'), updatePatientProfile);

// @route   GET api/patients/history
// @desc    Get patient medical history  
// @access  Private (patient)
router.get('/history', protect, authorize('patient'), getMedicalHistory);

module.exports = router;

