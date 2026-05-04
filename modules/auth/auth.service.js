const ApiError = require('../../shared/utils/ApiError');
const comparePassword = require('./utils/comparePassword');
const generateToken = require('./utils/generateToken');
const usersRepository = require('../users/users.repository');

async function login(email, password) {
  const user = await usersRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return { token };
}

module.exports = {
  login,
};
