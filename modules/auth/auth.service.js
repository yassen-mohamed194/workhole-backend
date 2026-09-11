const ApiError = require('../../shared/utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const buildTokenPayload = require('../../shared/utils/buildTokenPayload');
const { mapUserResponse } = require('../../shared/utils/mapUserResponse');
const comparePassword = require('./utils/comparePassword');
const generateAccessToken = require('./utils/generateAccessToken');
const generateRefreshToken = require('./utils/generateRefreshToken');
const hashPassword = require('./utils/hashPassword');
const authRepository = require('./auth.repository');
const usersRepository = require('../users/users.repository');

function normalizeRefreshPayload(decoded) {
  const permissions = Array.isArray(decoded.permissions) ? decoded.permissions : [];

  if (!decoded.id || !decoded.companyId || !decoded.membershipId || !decoded.roleId) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  return {
    id: decoded.id,
    companyId: decoded.companyId,
    membershipId: decoded.membershipId,
    roleId: decoded.roleId,
    permissions,
  };
}

async function login(identifier, password, companyCode) {
  const company = await authRepository.findCompanyByCode(companyCode);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  const user = await authRepository.findUserByIdentifier(identifier);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const membership = await authRepository.findCompanyMember(company._id, user._id);
  if (!membership) {
    throw new ApiError(403, 'User is not a member of this company');
  }

  if (membership.status !== 'active') {
    throw new ApiError(403, 'Membership inactive');
  }

  const tokenPayload = buildTokenPayload(user, company, membership);
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const hashedRefreshToken = await hashPassword(refreshToken);

  await authRepository.updateRefreshTokenById(user._id, hashedRefreshToken);

  const userResponse = mapUserResponse(user);
  userResponse.role = membership.roleId?.name;
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    accessToken,
    refreshToken,
    user: userResponse,
  };
}

async function refreshToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await authRepository.findUserByIdWithRefreshToken(decoded.id);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User is inactive');
  }

  const isTokenValid = await comparePassword(token, user.refreshToken);
  if (!isTokenValid) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const tokenPayload = normalizeRefreshPayload(decoded);
  const membership = await authRepository.findCompanyMember(tokenPayload.companyId, tokenPayload.id);
  if (!membership || String(membership._id) !== String(tokenPayload.membershipId)) {
    throw new ApiError(403, 'User is not a member of this company');
  }

  if (membership.status !== 'active') {
    throw new ApiError(403, 'Membership inactive');
  }

  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken };
}

async function logout(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await authRepository.findUserByIdWithRefreshToken(decoded.id);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const isTokenValid = await comparePassword(token, user.refreshToken);
  if (!isTokenValid) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  await authRepository.clearRefreshTokenById(user._id);
  return true;
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
  refreshToken,
  logout,
  changePassword,
};
