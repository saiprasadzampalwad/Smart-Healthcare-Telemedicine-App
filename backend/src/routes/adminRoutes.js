const express = require('express');
const router = express.Router();
const { getAdminDashboard, manageUsers, manageHospitals } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET api/admin/dashboard
// @desc    Admin dashboard stats
// @access  Private admin
router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);

// @route   GET api/admin/users  
// @desc    Manage all users
// @access  Private admin
router.get('/users', protect, authorize('admin'), manageUsers);

// @route   GET api/admin/hospitals
// @desc    Manage hospitals  
// @access  Private admin
router.get('/hospitals', protect, authorize('admin'), manageHospitals);

module.exports = router;

