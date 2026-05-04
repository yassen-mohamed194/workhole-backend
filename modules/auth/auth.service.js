const ApiError = require('../../shared/utils/ApiError');
const comparePassword = require('./utils/comparePassword');
const generateToken = require('./utils/generateToken');
const hashPassword = require('./utils/hashPassword');
const usersRepository = require('../users/users.repository');

async function login(identifier, password) {
  const user = await usersRepository.findByIdentifier(identifier);
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

async function changePassword(userId, oldPassword, newPassword) {
  const user = await usersRepository.findByIdWithPassword(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect current password');
  }

  const hashedPassword = await hashPassword(newPassword);
  await usersRepository.updatePasswordById(userId, hashedPassword);

  return { message: 'Password updated successfully' };
}

module.exports = {
  login,
  changePassword,
};
