const jwt = require('jsonwebtoken');
const config = require('../../config');
const ApiError = require('../utils/ApiError');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined || authHeader === null || authHeader === '') {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (typeof authHeader !== 'string') {
    return next(new ApiError(401, 'Invalid token format'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return next(new ApiError(401, 'Invalid token format'));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = authMiddleware;
