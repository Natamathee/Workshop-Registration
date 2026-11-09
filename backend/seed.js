/**
 * Seed script — creates sample admin, member accounts and workshops
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');
const Workshop = require('./models/Workshop');

const users = [
  {
    name: 'Admin User',
    email: 'admin@workshop.com',
    tel: '0800000001',
    password: 'Admin1234!',
    role: 'admin',
  },
  {
    name: 'Alice Member',
    email: 'alice@workshop.com',
    tel: '0811111111',
    password: 'Member1234!',
    role: 'member',
  },
  {
    name: 'Bob Member',
    email: 'bob@workshop.com',
    tel: '0822222222',
    password: 'Member1234!',
    role: 'member',
  },
];

const workshops = [
  {
    name: 'Introduction to Photography',
    description: 'Learn the fundamentals of photography including composition, lighting, and camera settings. Perfect for beginners who want to start capturing stunning images.',
    instructor: 'Sarah Johnson',
    workshopDate: '2026-11-10',
    location: 'Studio Room A, 3rd Floor',
    capacity: 20,
    category: 'Creative',
  },
  {
    name: 'Web Development with React',
    description: 'Hands-on workshop covering React fundamentals, hooks, and state management. Build a complete web application by the end of the session.',
    instructor: 'James Chen',
    workshopDate: '2026-11-15',
    location: 'Computer Lab 201',
    capacity: 25,
    category: 'Technology',
  },
  {
    name: 'UI/UX Design Principles',
    description: 'Explore user-centered design thinking, wireframing, and prototyping using Figma. Learn how to create intuitive and beautiful user interfaces.',
    instructor: 'Emma Davis',
    workshopDate: '2026-11-20',
    location: 'Design Studio, 2nd Floor',
    capacity: 15,
    category: 'Design',
  },
  {
    name: 'Data Science with Python',
    description: 'An introduction to data analysis and visualization using Python, Pandas, and Matplotlib. No prior experience required.',
    instructor: 'Dr. Michael Lee',
    workshopDate: '2026-11-25',
    location: 'Training Room B',
    capacity: 30,
    category: 'Technology',
  },
  {
    name: 'Public Speaking & Presentation Skills',
    description: 'Overcome stage fright and master the art of engaging storytelling. Practice delivering impactful presentations with expert feedback.',
    instructor: 'Linda Park',
    workshopDate: '2026-12-01',
    location: 'Conference Hall 1',
    capacity: 40,
    category: 'Business',
  },
  {
    name: 'Introduction to Machine Learning',
    description: 'Discover the core concepts of machine learning including supervised and unsupervised learning. Includes practical exercises using scikit-learn.',
    instructor: 'Dr. Michael Lee',
    workshopDate: '2026-12-05',
    location: 'Computer Lab 301',
    capacity: 20,
    category: 'Technology',
  },
  {
    name: 'Creative Writing Workshop',
    description: 'Develop your storytelling skills through writing exercises, peer reviews, and guided feedback from a published author.',
    instructor: 'Rachel Adams',
    workshopDate: '2026-12-10',
    location: 'Library Meeting Room',
    capacity: 15,
    category: 'Creative',
  },
  {
    name: 'Digital Marketing Essentials',
    description: 'Learn SEO, social media strategy, content marketing, and analytics to grow an online presence effectively.',
    instructor: 'Tom Wilson',
    workshopDate: '2026-12-15',
    location: 'Training Room C',
    capacity: 35,
    category: 'Business',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Workshop.deleteMany({});
    console.log('Cleared existing users and workshops');

    // Create users (pre-save hook handles password hashing)
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users:`);
    createdUsers.forEach((u) => console.log(`  - ${u.role}: ${u.email} / password: ${users.find(x => x.email === u.email).password}`));

    // Create workshops
    const createdWorkshops = await Workshop.create(workshops);
    console.log(`\nCreated ${createdWorkshops.length} workshops:`);
    createdWorkshops.forEach((w) => console.log(`  - ${w.name} (${w.workshopDate.toISOString().slice(0, 10)})`));

    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
