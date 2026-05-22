import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { readDb, writeDb, generateId } from '../config/mockDbManager.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_edusphere_jwt_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const userExists = db.users.find(u => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: generateId(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'student',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      };

      db.users.push(newUser);
      writeDb(db);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        token: generateToken(newUser._id),
      });
    } else {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const user = db.users.find(u => u.email === email.toLowerCase());
      
      // Let standard demo plain passwords work, or verify hashed password
      const isValid = user && (password === 'password123' || bcrypt.compareSync(password, user.password));

      if (isValid) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.comparePassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === "true") {
      const db = readDb();
      const user = db.users.find(u => u._id === req.user._id);
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      const user = await User.findById(req.user._id);
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
