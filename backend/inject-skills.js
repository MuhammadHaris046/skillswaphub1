const mongoose = require('mongoose');
const User = require('./models/User');
const Skill = require('./models/Skill');

const skillsToAdd = [
  { title: 'HTML/CSS', category: 'programming', description: 'Learn to build the structure and style of websites from scratch using modern HTML5 and CSS3.' },
  { title: 'JavaScript', category: 'programming', description: 'Master the fundamentals of JavaScript to create interactive and dynamic web applications.' },
  { title: 'Web Programming', category: 'programming', description: 'Full-stack web development basics covering both frontend and backend concepts.' },
  { title: 'Python', category: 'programming', description: 'Learn Python from scratch! I cover basic syntax, data structures, OOP, and practical projects.' },
  { title: 'Java', category: 'programming', description: 'Comprehensive Java programming covering object-oriented design and application development.' },
  { title: 'C++', category: 'programming', description: 'Dive into system-level programming and competitive coding with C++.' },
  { title: 'Data Structures', category: 'academic', description: 'Understand essential data structures and algorithms to ace your technical interviews.' },
  { title: 'Photoshop', category: 'design', description: 'I can teach you Photoshop basics, photo editing, and graphic design principles.' },
  { title: 'Graphic Design', category: 'design', description: 'Master the fundamentals of graphic design including color theory, typography, and layout design.' },
  { title: 'Video Editing', category: 'design', description: 'Learn how to edit professional videos using tools like Premiere Pro or Final Cut.' },
  { title: 'Digital Marketing', category: 'other', description: 'Understand SEO, social media marketing, and content strategy.' },
  { title: 'Public Speaking', category: 'other', description: 'Improve your communication skills, confidence, and presentation techniques.' },
  { title: 'Mathematics', category: 'academic', description: 'Help with Calculus, Algebra, and general university-level math courses.' },
  { title: 'Physics', category: 'academic', description: 'Tutoring for university physics, classical mechanics, and electromagnetism.' },
  { title: 'Other', category: 'other', description: 'Various miscellaneous skills and tutoring offered on a case-by-case basis.' }
];

async function run() {
  try {
    await mongoose.connect('mongodb+srv://abdullahumarch000_db_user:student123@cluster0.9oesrhs.mongodb.net/skillswap?retryWrites=true&w=majority');
    console.log('Connected to MongoDB Atlas...');

    // Find some users to assign skills to
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found in DB. Please register a user first.');
      process.exit(1);
    }

    // Clear existing skills to reset the list
    await Skill.deleteMany({});
    console.log('Cleared old skills...');

    // Insert new skills
    let userIndex = 0;
    for (const s of skillsToAdd) {
      const user = users[userIndex % users.length];
      await Skill.create({
        ...s,
        userId: user._id
      });
      userIndex++;
    }

    console.log('Successfully injected all 15 skills into the live database!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
