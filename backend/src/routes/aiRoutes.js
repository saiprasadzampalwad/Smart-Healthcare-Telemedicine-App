const express = require('express');
const router = express.Router();
const { checkSymptoms, chatBot } = require('../controllers/aiController');

// Using basic rate limiting or something? Leaving it public for testing easily
router.post('/symptoms', checkSymptoms);
router.post('/chat', chatBot);

module.exports = router;
