import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    [, token] = authHeader.split(' ');
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Unauthorized to access this router', 404));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    return next();
  } catch (err) {
    return next(new ErrorResponse('Unauthorized to access this router', 404));
  }
};

export default protect;