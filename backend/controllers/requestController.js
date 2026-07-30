const Request = require('../models/Request');
const Skill = require('../models/Skill');
const User = require('../models/User');

// Create a new request
const createRequest = async (req, res, next) => {
  try {
    const { skillId } = req.body;

    // Validate input
    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: 'Skill ID is required'
      });
    }

    // Find the skill
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user is trying to request their own skill
    if (skill.userId.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own skill'
      });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      skillId,
      fromUser: req.user.id,
      toUser: skill.userId
    });

    if (existingRequest) {
      // If request was rejected, allow re-requesting by deleting the old one
      if (existingRequest.status === 'rejected') {
        await Request.findByIdAndDelete(existingRequest._id);
      } else {
        return res.status(400).json({
          success: false,
          message: 'You have already requested this skill'
        });
      }
    }

    // Create request
    const request = await Request.create({
      skillId,
      fromUser: req.user.id,
      toUser: skill.userId,
      status: 'pending'
    });

    // Populate relevant data before returning
    const populatedRequest = await Request.findById(request._id)
      .populate('skillId', 'title category description')
      .populate('fromUser', 'name university')
      .populate('toUser', 'name university');

    res.status(201).json({
      success: true,
      message: 'Request sent successfully',
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get requests sent by logged-in user
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ fromUser: req.user.id })
      .populate('skillId', 'title category description')
      .populate('toUser', 'name university')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// Get requests received by logged-in user (as skill owner)
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ toUser: req.user.id })
      .populate('skillId', 'title category description')
      .populate('fromUser', 'name university')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// Update request status (accept/reject)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"'
      });
    }

    // Find the request
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the skill owner (toUser)
    if (request.toUser.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update requests for your skills'
      });
    }

    // Update status
    request.status = status;
    await request.save();

    // Populate and return
    const populatedRequest = await Request.findById(request._id)
      .populate('skillId', 'title category description')
      .populate('fromUser', 'name university')
      .populate('toUser', 'name university');

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// Check request status for a specific skill
const checkRequestStatus = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    // Find request for this skill and current user
    const request = await Request.findOne({
      skillId,
      fromUser: req.user.id
    });

    if (!request) {
      return res.json({
        success: true,
        data: {
          hasRequest: false,
          status: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        hasRequest: true,
        status: request.status,
        requestId: request._id
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  checkRequestStatus
};
