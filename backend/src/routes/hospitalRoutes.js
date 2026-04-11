const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById, updateBedAvailability } = require('../controllers/hospitalController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.put('/beds', protect, updateBedAvailability); // only authenticated hospitals can update their own beds

module.exports = router;
