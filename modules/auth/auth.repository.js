const usersRepository = require('../users/users.repository');
const companyRepository = require('../companies/company.repository');
const companyMemberRepository = require('../companies/companyMember.repository');

function findUserByIdentifier(identifier) {
  return usersRepository.findByIdentifier(identifier);
}

function findCompanyByCode(code) {
  return companyRepository.findCompanyByCode(code);
}

function findCompanyMember(companyId, userId) {
  return companyMemberRepository.findCompanyMember(companyId, userId);
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
  findCompanyByCode,
  findCompanyMember,
  updateRefreshTokenById,
  findUserByIdWithRefreshToken,
  clearRefreshTokenById,
};
