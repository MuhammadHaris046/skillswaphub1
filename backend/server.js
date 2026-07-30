require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Import routes
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import models
const User = require('./models/User');
const Skill = require('./models/Skill');

// Initialize Express app
const app = express();

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

async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    const skillCount = await Skill.countDocuments();

    if (userCount === 0 && skillCount === 0) {
      console.log('Database is empty. Seeding database...');

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
        userId: createdUsers[0]._id // Ahmed - Photoshop
      });
      console.log('Created skill: Photoshop');

      await Skill.create({
        ...seedSkills[1],
        userId: createdUsers[1]._id // Saif - Python
      });
      console.log('Created skill: Python Programming');

      await Skill.create({
        ...seedSkills[2],
        userId: createdUsers[2]._id // Saeed - Graphic Design
      });
      console.log('Created skill: Graphic Design');

      console.log('Database seeded successfully!');
    } else {
      console.log('Database already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabaseIfEmpty();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors()); // Enable CORS for all origins (can be restricted in production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend served from: http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});
