import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { readDb } from '../config/mockDbManager.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_edusphere_jwt_key_12345');
      
      if (process.env.USE_MOCK_DB === "true") {
        const db = readDb();
        req.user = db.users.find(u => u._id === decoded.id);
        // Exclude password in output representation
        if (req.user) {
          const { password, ...userWithoutPassword } = req.user;
          req.user = userWithoutPassword;
        }
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Role '${req.user?.role || 'none'}' is not authorized.` });
    }
    next();
  };
};
