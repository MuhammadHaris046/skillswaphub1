const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllSkills,
  getSkillById,
  getMySkills,
  createSkill,
  deleteSkill,
  checkSkillAvailability,
  getStats
} = require('../controllers/skillController');

// Public routes
router.get('/', getAllSkills);
router.get('/stats', getStats);

// Protected routes (specific routes must come before parameterized routes)
router.get('/check', authMiddleware, checkSkillAvailability);
router.get('/mine', authMiddleware, getMySkills);
router.post('/', authMiddleware, createSkill);
router.delete('/:id', authMiddleware, deleteSkill);

// Public route (must come after specific routes)
router.get('/:id', getSkillById);

module.exports = router;
