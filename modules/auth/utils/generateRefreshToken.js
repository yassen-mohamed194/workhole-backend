const jwt = require('jsonwebtoken');
const config = require('../../../config');

function generateRefreshToken(payload) {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
}

module.exports = generateRefreshToken;
