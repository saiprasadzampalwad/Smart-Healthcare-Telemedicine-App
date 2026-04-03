const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptions } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('doctor'), createPrescription);
router.get('/', getPrescriptions);

module.exports = router;
