const ApiError = require('../../shared/utils/ApiError');
const hashPassword = require('../auth/utils/hashPassword');
const usersRepository = require('./users.repository');

async function createUser(payload) {
  const existingUser = await usersRepository.findByEmail(payload.email);
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  try {
    const hashedPassword = await hashPassword(payload.password);
    const createdUser = await usersRepository.createUser({
      ...payload,
      password: hashedPassword,
    });

    return {
      id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      shiftId: createdUser.shiftId,
      createdAt: createdUser.createdAt,
    };
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Email already exists');
    }
    throw error;
  }
}

function getUsers() {
  return usersRepository.findAll();
}

async function getUserById(id) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

async function updateUserByAdmin(id, payload) {
  const existingUser = await usersRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const allowedFields = ['firstName', 'lastName', 'phone', 'role', 'status', 'shiftId'];
  const updateData = {};

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  }

  const updatedUser = await usersRepository.updateById(id, updateData);
  return updatedUser;
}

async function deleteUserByAdmin(id) {
  const existingUser = await usersRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  if (existingUser.role === 'admin') {
    throw new ApiError(403, 'Cannot delete admin');
  }

  await usersRepository.deleteById(id);

  return {
    message: 'User deleted successfully',
  };
}

async function updateUserStatusByAdmin(id, status) {
  const allowedStatuses = ['active', 'inactive'];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const existingUser = await usersRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const updatedUser = await usersRepository.updateStatusById(id, status);
  return updatedUser;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUserStatusByAdmin,
};
