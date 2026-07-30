const mongoose = require('mongoose');
const Request = require('./models/Request');
const Skill = require('./models/Skill');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const request = await Request.findById('6a5f46818a87e19ef3a1e856')
      .populate('skillId', 'title')
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');
    
    if (request) {
      console.log('Request Details:');
      console.log('Skill:', request.skillId?.title);
      console.log('From (requester):', request.fromUser?.name, request.fromUser?.email);
      console.log('To (skill owner):', request.toUser?.name, request.toUser?.email);
      console.log('Status:', request.status);
    } else {
      console.log('Request not found');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err.message);
    mongoose.connection.close();
  });