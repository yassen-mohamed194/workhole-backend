const ApiError = require('../../shared/utils/ApiError');
const usersService = require('./users.service');

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
    const rawTokenId = req.user.id;
    const userIdAsString =
      rawTokenId && typeof rawTokenId === 'object' && '$oid' in rawTokenId
        ? String(rawTokenId.$oid)
        : String(rawTokenId ?? '');
    const paramIdAsString = String(req.params.id);
    const isAdmin = req.user.role === 'admin';
    const isSelf = userIdAsString === paramIdAsString;
    if (!isAdmin && !isSelf) {
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
