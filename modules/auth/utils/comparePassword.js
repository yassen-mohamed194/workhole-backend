const bcrypt = require('bcryptjs');

async function comparePassword(rawPassword, hashedPassword) {
  return bcrypt.compare(rawPassword, hashedPassword);
}

module.exports = comparePassword;
