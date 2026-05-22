import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import { readDb, writeDb, generateId } from '../config/mockDbManager.js';

// @desc    Get all courses with search & filter
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      let filtered = [...db.courses];

      const { search, category, level, sort } = req.query;

      // Filter by Search Query
      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.shortDescription.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by Category
      if (category) {
        filtered = filtered.filter((c) => c.category === category);
      }

      // Filter by Skill Level
      if (level) {
        filtered = filtered.filter((c) => c.level === level);
      }

      // Sorting
      if (sort === 'popular') {
        filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      } else if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else {
        // newest default
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }

      res.json(filtered);
    } else {
      const { search, category, level, minPrice, maxPrice, sort } = req.query;
      const query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
        ];
      }

      if (category) query.category = category;
      if (level) query.level = level;

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let apiQuery = Course.find(query).populate('instructor', 'name avatar');

      if (sort) {
        if (sort === 'popular') apiQuery = apiQuery.sort('-rating');
        else if (sort === 'price-low') apiQuery = apiQuery.sort('price');
        else if (sort === 'price-high') apiQuery = apiQuery.sort('-price');
      } else {
        apiQuery = apiQuery.sort('-createdAt');
      }

      const courses = await apiQuery;
      res.json(courses);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const course = db.courses.find((c) => c._id === req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } else {
      const course = await Course.findById(req.params.id).populate('instructor', 'name avatar role');
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req, res) => {
  try {
    const { title, shortDescription, description, category, level, price, thumbnail, curriculum } = req.body;

    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      
      // Inject IDs for modules and lessons
      const curriculumWithIds = (curriculum || []).map((mod) => ({
        ...mod,
        lessons: (mod.lessons || []).map((les) => ({
          ...les,
          _id: generateId(),
        })),
      }));

      const newCourse = {
        _id: generateId(),
        title,
        shortDescription,
        description,
        category,
        level,
        price: price || 0,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        rating: 4.8,
        ratingsCount: 1,
        createdAt: new Date().toISOString(),
        instructor: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar,
        },
        curriculum: curriculumWithIds,
      };

      db.courses.push(newCourse);
      writeDb(db);

      res.status(201).json(newCourse);
    } else {
      const course = await Course.create({
        title,
        shortDescription,
        description,
        category,
        level,
        price: price || 0,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        instructor: req.user._id,
        curriculum: curriculum || [],
      });
      res.status(201).json(course);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const idx = db.courses.findIndex((c) => c._id === req.params.id);

      if (idx === -1) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const course = db.courses[idx];
      const instructorId = course.instructor._id || course.instructor;

      if (instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this course' });
      }

      db.courses[idx] = { ...course, ...req.body };
      writeDb(db);

      res.json(db.courses[idx]);
    } else {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this course' });
      }

      const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('instructor', 'name avatar');

      res.json(updatedCourse);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
export const deleteCourse = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const course = db.courses.find((c) => c._id === req.params.id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const instructorId = course.instructor._id || course.instructor;

      if (instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this course' });
      }

      db.courses = db.courses.filter((c) => c._id !== req.params.id);
      writeDb(db);

      res.json({ message: 'Course deleted successfully' });
    } else {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this course' });
      }

      await Course.findByIdAndDelete(req.params.id);
      res.json({ message: 'Course deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses created by current instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private/Instructor
export const getInstructorCourses = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const courses = db.courses.filter((c) => {
        const instId = c.instructor?._id || c.instructor;
        return instId.toString() === req.user._id.toString();
      });
      res.json(courses);
    } else {
      const courses = await Course.find({ instructor: req.user._id });
      res.json(courses);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor dashboard metrics
// @route   GET /api/courses/instructor/dashboard-stats
// @access  Private/Instructor
export const getInstructorStats = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      
      const instructorCourses = db.courses.filter((c) => {
        const instId = c.instructor?._id || c.instructor;
        return instId.toString() === req.user._id.toString();
      });

      const courseIds = instructorCourses.map((c) => c._id);
      const studentCount = db.enrollments.filter((e) => courseIds.includes(e.courseId || e.course)).length;

      let totalEarnings = 0;
      instructorCourses.forEach((c) => {
        const enrollCount = db.enrollments.filter((e) => {
          const cId = e.course?._id || e.course;
          return cId.toString() === c._id.toString();
        }).length;
        totalEarnings += enrollCount * c.price;
      });

      res.json({
        totalCourses: instructorCourses.length,
        totalStudents: studentCount,
        totalEarnings: totalEarnings,
      });
    } else {
      const courses = await Course.find({ instructor: req.user._id });
      const courseIds = courses.map((c) => c._id);
      const enrollmentsCount = await Enrollment.countDocuments({ course: { $in: courseIds } });

      let totalEarnings = 0;
      for (const course of courses) {
        const studentCount = await Enrollment.countDocuments({ course: course._id });
        totalEarnings += studentCount * course.price;
      }

      res.json({
        totalCourses: courses.length,
        totalStudents: enrollmentsCount,
        totalEarnings: totalEarnings,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
