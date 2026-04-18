import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach user to req.user (and userId for convenience)
    req.user = user;
    req.userId = decoded.userId;
    
    // 5. Call next()
    next();
  } catch (error) {
    // 6. If invalid → return 401
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;