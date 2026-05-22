import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentProgress,
  updateLessonProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/enroll/:courseId', protect, enrollInCourse);
router.get('/my-courses', protect, getMyEnrollments);
router.get('/progress/:courseId', protect, getEnrollmentProgress);
router.put('/progress/:courseId/lesson/:lessonId', protect, updateLessonProgress);

export default router;
