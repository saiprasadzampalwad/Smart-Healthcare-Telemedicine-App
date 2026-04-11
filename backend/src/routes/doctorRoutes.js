const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, getProfile, updateProfile } = require('../controllers/doctorController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

module.exports = router;
