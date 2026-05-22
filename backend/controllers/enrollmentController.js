import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { readDb, writeDb, generateId } from '../config/mockDbManager.js';

// @desc    Enroll a student in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private/Student
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      
      const course = db.courses.find(c => c._id === courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const existing = db.enrollments.find(
        e => e.student.toString() === studentId.toString() && (e.course?._id || e.course).toString() === courseId.toString()
      );

      if (existing) {
        return res.status(400).json({ message: 'Already enrolled in this course', enrollment: existing });
      }

      const enrollment = {
        _id: generateId(),
        student: studentId,
        course: course, // Populated representational course
        completedLessons: [],
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.enrollments.push(enrollment);
      writeDb(db);

      res.status(201).json({
        message: 'Successfully enrolled in course',
        enrollment,
      });
    } else {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course', enrollment: existingEnrollment });
      }

      const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        progress: 0,
        completed: false,
      });

      res.status(201).json({
        message: 'Successfully enrolled in course',
        enrollment,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
export const getMyEnrollments = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const studentEnrollments = db.enrollments.filter(
        e => (e.student?._id || e.student).toString() === req.user._id.toString()
      );
      res.json(studentEnrollments);
    } else {
      const enrollments = await Enrollment.find({ student: req.user._id })
        .populate({
          path: 'course',
          populate: {
            path: 'instructor',
            select: 'name avatar',
          },
        });
      res.json(enrollments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get progress details for a course
// @route   GET /api/enrollments/progress/:courseId
// @access  Private/Student
export const getEnrollmentProgress = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const enrollment = db.enrollments.find(
        e => (e.student?._id || e.student).toString() === req.user._id.toString() &&
             (e.course?._id || e.course).toString() === req.params.courseId.toString()
      );

      if (!enrollment) {
        return res.status(404).json({ message: 'No enrollment found for this course' });
      }

      res.json(enrollment);
    } else {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId,
      });

      if (!enrollment) {
        return res.status(404).json({ message: 'No enrollment found for this course' });
      }

      res.json(enrollment);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle lesson progress (complete / incomplete)
// @route   PUT /api/enrollments/progress/:courseId/lesson/:lessonId
// @access  Private/Student
export const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed } = req.body;

    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const course = db.courses.find(c => c._id === courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      let totalLessonsCount = 0;
      course.curriculum.forEach((module) => {
        totalLessonsCount += module.lessons.length;
      });

      if (totalLessonsCount === 0) {
        return res.status(400).json({ message: 'Course curriculum is empty' });
      }

      const idx = db.enrollments.findIndex(
        e => (e.student?._id || e.student).toString() === req.user._id.toString() &&
             (e.course?._id || e.course).toString() === courseId.toString()
      );

      if (idx === -1) {
        return res.status(404).json({ message: 'Not enrolled in this course' });
      }

      const enrollment = db.enrollments[idx];
      const lessonIndex = enrollment.completedLessons.indexOf(lessonId);

      if (completed) {
        if (lessonIndex === -1) enrollment.completedLessons.push(lessonId);
      } else {
        if (lessonIndex !== -1) enrollment.completedLessons.splice(lessonIndex, 1);
      }

      const progressPercent = Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100);
      enrollment.progress = progressPercent;
      enrollment.completed = progressPercent === 100;
      enrollment.updatedAt = new Date().toISOString();

      db.enrollments[idx] = enrollment;
      writeDb(db);

      res.json({
        message: 'Progress updated successfully',
        enrollment,
      });
    } else {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      let totalLessonsCount = 0;
      course.curriculum.forEach((module) => {
        totalLessonsCount += module.lessons.length;
      });

      if (totalLessonsCount === 0) {
        return res.status(400).json({ message: 'Course curriculum is empty' });
      }

      let enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
      if (!enrollment) {
        return res.status(404).json({ message: 'Not enrolled in this course' });
      }

      const lessonIndex = enrollment.completedLessons.indexOf(lessonId);

      if (completed) {
        if (lessonIndex === -1) {
          enrollment.completedLessons.push(lessonId);
        }
      } else {
        if (lessonIndex !== -1) {
          enrollment.completedLessons.splice(lessonIndex, 1);
        }
      }

      const progressPercent = Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100);
      enrollment.progress = progressPercent;
      enrollment.completed = progressPercent === 100;

      await enrollment.save();

      res.json({
        message: 'Progress updated successfully',
        enrollment,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
