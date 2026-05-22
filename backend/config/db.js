import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edusphere');
    console.log(`\x1b[32m%s\x1b[0m`, `MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = "false";
  } catch (error) {
    console.log(`\x1b[33m%s\x1b[0m`, `WARNING: Local MongoDB service not active (${error.message}).`);
    console.log(`\x1b[32m%s\x1b[0m`, `EduSphere is automatically falling back to Persistent JSON File Database (backend/mockDb.json)!`);
    console.log(`\x1b[36m%s\x1b[0m`, `You can use the platform 100% features: browse, auth, enroll, check progress, and print certificates.`);
    process.env.USE_MOCK_DB = "true";
  }
};

export default connectDB;
