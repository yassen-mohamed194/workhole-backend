const jwt = require('jsonwebtoken');
const config = require('../../../config');

function generateAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

module.exports = generateAccessToken;
