const Skill = require('../models/Skill');
const User = require('../models/User');

// Get platform statistics
const getStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const skillCount = await Skill.countDocuments();

    res.json({
      success: true,
      data: {
        userCount,
        skillCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all skills with optional search and category filter
const getAllSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Find skills and populate owner info
    const skills = await Skill.find(query)
      .populate('userId', 'name university')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// Get single skill by ID
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('userId', 'name university');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// Get skills owned by logged-in user
const getMySkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// Create a new skill
const createSkill = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;

    // Validate input
    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create skill with logged-in user's ID
    const skill = await Skill.create({
      title,
      category,
      description,
      userId: req.user.id
    });

    // Populate owner info before returning
    const populatedSkill = await Skill.findById(skill._id)
      .populate('userId', 'name university');

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: populatedSkill
    });
  } catch (error) {
    next(error);
  }
};

// Delete a skill (only if owned by the user)
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own skills'
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Check if user already has a skill with the given title
const checkSkillAvailability = async (req, res, next) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Check if user already has a skill with this title
    const existingSkill = await Skill.findOne({
      userId: req.user.id,
      title: { $regex: `^${title}$`, $options: 'i' }
    });

    if (existingSkill) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: 'You already added this skill'
        }
      });
    }

    res.json({
      success: true,
      data: {
        available: true,
        message: 'Skill available'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  getMySkills,
  createSkill,
  deleteSkill,
  checkSkillAvailability,
  getStats
};
