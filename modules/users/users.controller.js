const ApiError = require('../../shared/utils/ApiError');
const { PERMISSIONS, WILDCARD_PERMISSION } = require('../../shared/constants/permissions');
const usersService = require('./users.service');

function hasPermission(user, permission) {
  const permissions = user.permissions || [];
  return permissions.includes(WILDCARD_PERMISSION) || permissions.includes(permission);
}

function normalizeUserId(rawId) {
  if (rawId && typeof rawId === 'object' && '$oid' in rawId) {
    return String(rawId.$oid);
  }
  return String(rawId ?? '');
}

async function createUser(req, res, next) {
  try {
    const user = await usersService.createUser(req.body);
    return res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await usersService.getUsers();
    return res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userIdAsString = normalizeUserId(req.user.id);
    const paramIdAsString = String(req.params.id);
    const canReadUsers = hasPermission(req.user, PERMISSIONS.USERS_READ);
    const isSelf = userIdAsString === paramIdAsString;

    if (!canReadUsers && !isSelf) {
      return next(new ApiError(403, 'Forbidden'));
    }

    const user = await usersService.getUserById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUserByAdmin(req, res, next) {
  try {
    const updatedUser = await usersService.updateUserByAdmin(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUserByAdmin(req, res, next) {
  try {
    const result = await usersService.deleteUserByAdmin(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUserStatusByAdmin(req, res, next) {
  try {
    const updatedUser = await usersService.updateUserStatusByAdmin(req.params.id, req.body.status);
    return res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUserStatusByAdmin,
};
