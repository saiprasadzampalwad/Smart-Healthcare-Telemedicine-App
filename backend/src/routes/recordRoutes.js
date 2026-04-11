const express = require('express');
const router = express.Router();
const { getUnifiedRecord } = require('../controllers/recordController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/patient/:patient_id', protect, getUnifiedRecord);

module.exports = router;
