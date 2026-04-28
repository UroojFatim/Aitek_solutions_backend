// middleware/verifyToken.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { UserStatus } from '../enums/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token. Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded now contains id, role, full_name, email, iat, exp
    req.user = decoded;
    
    // Check if user is deleted (soft delete check)
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found. Unauthorized' });
    }
    
    if (user.status === UserStatus.DELETED) {
      return res.status(401).json({ message: 'This account has been deleted and cannot be accessed.' });
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;