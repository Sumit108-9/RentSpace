import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if this is an admin token (has role: admin)
      if (decoded.role === 'admin' && decoded.id) {
        // Verify admin exists in database
        const admin = await User.findById(decoded.id).select('-password');
        if (!admin || admin.role !== 'admin') {
          return res.status(401).json({ success: false, message: 'Admin not found or invalid role' });
        }
        req.user = admin;
        return next();
      }
      
      // Regular user token - fetch from database
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } catch (error) {
    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

// Alias export for compatibility
export const admin = adminOnly;
