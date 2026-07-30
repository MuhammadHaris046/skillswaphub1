require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Skill = require('./models/Skill');

// Seed data
const seedUsers = [
  {
    name: 'Ahmed',
    email: 'ahmed@example.com',
    password: '123456789',
    university: 'UAE'
  },
  {
    name: 'Saif',
    email: 'saif@example.com',
    password: '123456789',
    university: 'UAE'
  },
  {
    name: 'Saeed',
    email: 'saeed@example.com',
    password: '123456789',
    university: 'UAE'
  }
];

const seedSkills = [
  {
    title: 'Photoshop',
    category: 'design',
    description: 'I can teach you Photoshop basics, photo editing, and graphic design principles. Perfect for beginners who want to learn design tools.',
  },
  {
    title: 'Python Programming',
    category: 'programming',
    description: 'Learn Python from scratch! I cover basic syntax, data structures, OOP, and practical projects. Great for computer science students.',
  },
  {
    title: 'Graphic Design',
    category: 'design',
    description: 'Master the fundamentals of graphic design including color theory, typography, and layout design using industry-standard tools.',
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create skills (assign to different users)
    await Skill.create({
      ...seedSkills[0],
      userId: createdUsers[0]._id 
    });
    console.log('Created skill: Photoshop');

    await Skill.create({
      ...seedSkills[1],
      userId: createdUsers[1]._id 
    });
    console.log('Created skill: Python Programming');

    await Skill.create({
      ...seedSkills[2],
      userId: createdUsers[2]._id 
    });
    console.log('Created skill: Graphic Design');

    console.log('Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Ahmed: ahmed@example.com / 123456789');
    console.log('Saeed: saeed@example.com / 123456789');
    console.log('Saif: saif@example.com / 123456789');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seed function
seedDatabase();
