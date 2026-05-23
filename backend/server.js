import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://frontend-five-alpha-pm0xeugm9e.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the EduSphere Online Course Platform API',
    status: 'healthy',
    database: process.env.USE_MOCK_DB === 'true' ? 'mock_db (JSON Fallback)' : 'mongodb_atlas',
    error: process.env.USE_MOCK_DB === 'true' ? process.env.DB_CONN_ERROR : undefined,
    version: '1.0.0',
  });
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Route not found: ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
