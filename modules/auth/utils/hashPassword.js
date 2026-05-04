const bcrypt = require('bcryptjs');

async function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, 12);
}

module.exports = hashPassword;
