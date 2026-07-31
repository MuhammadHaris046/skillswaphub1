const mongoose = require('mongoose');
const User = require('./models/User');
const Skill = require('./models/Skill');

async function run() {
  try {
    await mongoose.connect('mongodb+srv://abdullahumarch000_db_user:student123@cluster0.9oesrhs.mongodb.net/skillswap?retryWrites=true&w=majority');
    console.log('Connected to MongoDB Atlas...');

    // Find the specific users by their names
    const users = await User.find({
      name: { 
        $in: [
          /fahad/i, 
          /Ahsan Kamal/i, 
          /Abdul Rehman Yousufi/i
        ] 
      }
    });

    if (users.length === 0) {
      console.log('Could not find those users in the database.');
    } else {
      for (const user of users) {
        // Delete all skills that belong to this user
        const result = await Skill.deleteMany({ userId: user._id });
        console.log(`✅ Deleted ${result.deletedCount} skills offered by: ${user.name}`);
      }
    }

    console.log('Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
