import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edusphere');
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Review.deleteMany();
    console.log('Cleared all previous data.');

    // 1. Create Users
    const student = await User.create({
      name: 'John Doe',
      email: 'student@edusphere.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JohnDoe',
    });

    const instructor = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'instructor@edusphere.com',
      password: 'password123',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SarahJenkins',
    });

    const admin = await User.create({
      name: 'Admin Controller',
      email: 'admin@edusphere.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AdminController',
    });

    console.log('Users seeded successfully.');

    // 2. Create Courses
    const courses = [
      {
        title: 'Full-Stack Web Development BootCamp 2026',
        shortDescription: 'Become a professional developer from scratch! Master React, Node.js, Express, and MongoDB.',
        description: 'This is a premium, comprehensive React, Node.js, Express, and MongoDB bundle. Throughout this course, you will learn the core foundations of client-server application building. Start from absolute zero by learning semantic HTML & CSS layout models, progress through React state systems, side-effects, and context architecture, and finish by mounting custom APIs in Express, configuring JWT authorization middleware, and managing Mongoose databases.',
        category: 'Development',
        level: 'Beginner',
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
        instructor: instructor._id,
        curriculum: [
          {
            title: 'Module 1: Getting Started with React',
            lessons: [
              {
                title: 'Introduction to React & Vite Setup',
                duration: '12 mins',
                content: 'Welcome to your first React course! In this lesson, we will explore why React is the modern standard for front-end architecture. We will cover the virtual DOM, Single Page Application concepts, and setup our very first React project using the lightning-fast Vite build tool. Go ahead and install Node.js, run `npm create vite@latest`, and explore the default project layout.',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
              {
                title: 'Understanding JSX & Components',
                duration: '18 mins',
                content: 'JSX stands for JavaScript XML. It allows us to write HTML-like markup directly inside our JS scripts. In this lesson, we will cover the syntactic difference between HTML and JSX (e.g. `className` instead of `class`, curly braces for expression evaluations), and build our first custom functional React components.',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
            ],
          },
          {
            title: 'Module 2: State & Effect Hooks',
            lessons: [
              {
                title: 'Managing State with useState',
                duration: '15 mins',
                content: 'State represents mutable data that drives component updates. In this module, we will explore the `useState` React hook. Learn how to declare state variables, hook up onClick listeners, and handle interactive form inputs with React controlled components.',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
              {
                title: 'Data Fetching with useEffect',
                duration: '22 mins',
                content: 'Side-effects are operations that affect things outside our immediate scope, like HTTP requests, timers, or subscribing to events. Learn how to use the `useEffect` hook to fetch high-fidelity data from a REST API server, trigger updates on dependencies, and properly return clean-up functions to prevent memory leaks.',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
            ],
          },
        ],
      },
      {
        title: 'Artificial Intelligence & Deep Learning',
        shortDescription: 'Master the theory and implementation of modern Machine Learning algorithms, Neural Networks, and LLMs.',
        description: 'Dive deep into modern machine learning! Master core algorithms like linear and logistic regression, build custom convolutional and recurrent neural networks using PyTorch, and understand the internal architecture of Large Language Models (LLMs) like Transformers.',
        category: 'AI & Data Science',
        level: 'Advanced',
        price: 149,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
        instructor: instructor._id,
        curriculum: [
          {
            title: 'Module 1: Neural Networks Foundations',
            lessons: [
              {
                title: 'Introduction to Deep Learning & PyTorch',
                duration: '20 mins',
                content: 'Deep learning is a subset of machine learning based on artificial neural networks. Today we will install PyTorch, verify CUDA setup for GPU acceleration, and create basic tensor structures to represent high-dimensional numerical weights.',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
              {
                title: 'Building a Multi-Layer Perceptron (MLP)',
                duration: '25 mins',
                content: 'Learn how to construct neural network layers, write feedforward calculation chains, apply activation functions (ReLU, Sigmoid), calculate Cross-Entropy loss functions, and perform backpropagation to optimize weight settings.',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
            ],
          },
        ],
      },
      {
        title: 'UI/UX Design Masterclass: Figma to Code',
        shortDescription: 'Learn design systems, glassmorphism, responsive visual hierarchies, and convert custom Figma layouts to code.',
        description: 'A masterclass for designers and front-end developers who want to bridge the gap. Explore color palettes, HSL tailoring, glassmorphism UI styles, grid systems, custom typography, micro-interactions, responsive frameworks, and convert your Figma files into pixel-perfect CSS templates.',
        category: 'Design',
        level: 'Intermediate',
        price: 49,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=60',
        instructor: instructor._id,
        curriculum: [
          {
            title: 'Module 1: Figma Layouts & Systems',
            lessons: [
              {
                title: 'Creating Consistent Design Systems in Figma',
                duration: '15 mins',
                content: 'Design systems form the backbone of clean layouts. In this lesson, we will construct cohesive styles for colors, grids, shadows, typography hierarchies, and reusable components. This establishes unified branding across all digital surfaces.',
                videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
            ],
          },
        ],
      },
    ];

    const seededCourses = await Course.insertMany(courses);
    console.log('Courses seeded successfully.');

    // 3. Create Reviews and Update Rating statistics
    const reviews = [
      {
        user: student._id,
        course: seededCourses[0]._id,
        rating: 5,
        comment: 'This is the most comprehensive full-stack bootcamp I have ever taken! The modular curriculum is perfect and the projects look premium.',
      },
      {
        user: student._id,
        course: seededCourses[1]._id,
        rating: 4,
        comment: 'Very advanced math but incredibly satisfying. PyTorch labs were extremely helpful!',
      },
    ];

    await Review.insertMany(reviews);

    // Update course ratings in DB
    for (const course of seededCourses) {
      const courseReviews = await Review.find({ course: course._id });
      const ratingsCount = courseReviews.length;
      let averageRating = 4.8; // Default mock rating
      if (ratingsCount > 0) {
        const totalStars = courseReviews.reduce((acc, item) => item.rating + acc, 0);
        averageRating = Math.round((totalStars / ratingsCount) * 10) / 10;
      }
      await Course.findByIdAndUpdate(course._id, {
        rating: averageRating,
        ratingsCount: ratingsCount || 24, // Seed a nice number of mock ratings if empty
      });
    }

    console.log('Reviews seeded & course rating statistics synchronized.');

    console.log('\x1b[32m%s\x1b[0m', 'DATABASE SUCCESSFULLY SEEDED!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed: ', error.message);
    process.exit(1);
  }
};

seedData();
