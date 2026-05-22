import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getInstructorStats,
} from '../controllers/courseController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructor/my-courses', protect, restrictTo('instructor', 'admin'), getInstructorCourses);
router.get('/instructor/dashboard-stats', protect, restrictTo('instructor', 'admin'), getInstructorStats);
router.get('/:id', getCourseById);
router.post('/', protect, restrictTo('instructor', 'admin'), createCourse);
router.put('/:id', protect, restrictTo('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, restrictTo('instructor', 'admin'), deleteCourse);

export default router;
