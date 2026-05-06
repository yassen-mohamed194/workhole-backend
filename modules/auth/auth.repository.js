const usersRepository = require('../users/users.repository');

function findUserByIdentifier(identifier) {
  return usersRepository.findByIdentifier(identifier);
}

function updateRefreshTokenById(userId, refreshToken) {
  return usersRepository.updateRefreshTokenById(userId, refreshToken);
}

function findUserByIdWithRefreshToken(userId) {
  return usersRepository.findByIdWithRefreshToken(userId);
}

function clearRefreshTokenById(userId) {
  return usersRepository.updateRefreshTokenById(userId, null);
}

module.exports = {
  findUserByIdentifier,
  updateRefreshTokenById,
  findUserByIdWithRefreshToken,
  clearRefreshTokenById,
};
