import Review from '../models/Review.js';
import Course from '../models/Course.js';
import { readDb, writeDb, generateId } from '../config/mockDbManager.js';

// Helper to recalculate course rating in mock db
const updateMockCourseRatingStats = (db, courseId) => {
  const courseReviews = db.reviews.filter((r) => r.course.toString() === courseId.toString());
  const ratingsCount = courseReviews.length;
  
  let averageRating = 4.8;
  if (ratingsCount > 0) {
    const totalStars = courseReviews.reduce((acc, item) => item.rating + acc, 0);
    averageRating = Math.round((totalStars / ratingsCount) * 10) / 10;
  }

  const courseIdx = db.courses.findIndex((c) => c._id === courseId);
  if (courseIdx !== -1) {
    db.courses[courseIdx].rating = averageRating;
    db.courses[courseIdx].ratingsCount = ratingsCount;
  }
};

// Helper to recalculate course rating
const updateCourseRatingStats = async (courseId) => {
  const reviews = await Review.find({ course: courseId });
  const ratingsCount = reviews.length;
  
  let averageRating = 0;
  if (ratingsCount > 0) {
    const totalStars = reviews.reduce((acc, item) => item.rating + acc, 0);
    averageRating = Math.round((totalStars / ratingsCount) * 10) / 10;
  }

  await Course.findByIdAndUpdate(courseId, {
    rating: averageRating,
    ratingsCount: ratingsCount,
  });
};

// @desc    Create or update a course review
// @route   POST /api/reviews/:courseId
// @access  Private/Student
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const userId = req.user._id;

    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();

      const course = db.courses.find((c) => c._id === courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      let reviewIdx = db.reviews.findIndex(
        (r) => r.user?._id?.toString() === userId.toString() || r.user?.toString() === userId.toString() && r.course.toString() === courseId.toString()
      );

      let savedReview;

      if (reviewIdx !== -1) {
        db.reviews[reviewIdx].rating = rating;
        db.reviews[reviewIdx].comment = comment;
        db.reviews[reviewIdx].updatedAt = new Date().toISOString();
        savedReview = db.reviews[reviewIdx];
      } else {
        savedReview = {
          _id: generateId(),
          user: {
            _id: req.user._id,
            name: req.user.name,
            avatar: req.user.avatar,
          },
          course: courseId,
          rating: Number(rating),
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.reviews.push(savedReview);
      }

      updateMockCourseRatingStats(db, courseId);
      writeDb(db);

      res.status(201).json({
        message: 'Review saved successfully',
        review: savedReview,
      });
    } else {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      let review = await Review.findOne({ user: userId, course: courseId });

      if (review) {
        review.rating = rating;
        review.comment = comment;
        await review.save();
      } else {
        review = await Review.create({
          user: userId,
          course: courseId,
          rating,
          comment,
        });
      }

      await updateCourseRatingStats(courseId);

      res.status(201).json({
        message: 'Review saved successfully',
        review,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
export const getCourseReviews = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const courseReviews = db.reviews.filter((r) => r.course.toString() === req.params.courseId.toString());
      
      // Sort newest reviews first
      courseReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(courseReviews);
    } else {
      const reviews = await Review.find({ course: req.params.courseId })
        .populate('user', 'name avatar')
        .sort('-createdAt');
      res.json(reviews);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
