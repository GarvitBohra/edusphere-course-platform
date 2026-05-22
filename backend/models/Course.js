import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '10 mins',
  },
  content: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a course category'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    curriculum: [moduleSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
