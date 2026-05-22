import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../mockDb.json');

// Read full DB
export const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mockDb.json:', error.message);
    return { users: [], courses: [], enrollments: [], reviews: [] };
  }
};

// Write full DB
export const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing mockDb.json:', error.message);
    return false;
  }
};

// Helper generator to simulate ObjectIds
export const generateId = () => {
  return 'mock_' + Math.random().toString(36).substr(2, 9);
};
