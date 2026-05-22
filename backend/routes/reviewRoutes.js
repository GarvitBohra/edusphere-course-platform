import express from 'express';
import { createReview, getCourseReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', getCourseReviews);
router.post('/:courseId', protect, createReview);

export default router;
