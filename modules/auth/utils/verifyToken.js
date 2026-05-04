const jwt = require('jsonwebtoken');
const config = require('../../../config');

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = verifyToken;
