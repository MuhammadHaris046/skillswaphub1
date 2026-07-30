const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  checkRequestStatus
} = require('../controllers/requestController');

// All request routes are protected (specific routes must come before parameterized routes)
router.post('/', authMiddleware, createRequest);
router.get('/sent', authMiddleware, getSentRequests);
router.get('/received', authMiddleware, getReceivedRequests);
router.get('/check/:skillId', authMiddleware, checkRequestStatus);
router.patch('/:id', authMiddleware, updateRequestStatus);

module.exports = router;
