const ApiError = require('../../shared/utils/ApiError');
const { SYSTEM_ADMIN_ROLE, SYSTEM_EMPLOYEE_ROLE } = require('../../shared/constants/permissions');
const { mapUserResponse, mapUsersResponse } = require('../../shared/utils/mapUserResponse');
const hashPassword = require('../auth/utils/hashPassword');
const rolesRepository = require('../roles/roles.repository');
const shiftsRepository = require('../shifts/shifts.repository');
const usersRepository = require('./users.repository');

async function resolveRoleId(roleName) {
  const role = await rolesRepository.findRoleByName(roleName || SYSTEM_EMPLOYEE_ROLE);
  if (!role) {
    throw new ApiError(400, 'Invalid role');
  }
  return role._id;
}

async function createUser(payload) {
  const existingUser = await usersRepository.findByEmail(payload.email);
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  const roleId = await resolveRoleId(payload.role);

  try {
    const hashedPassword = await hashPassword(payload.password);
    const { role, password, ...userData } = payload;
    const createdUser = await usersRepository.createUser({
      ...userData,
      roleId,
      password: hashedPassword,
    });

    const mappedUser = mapUserResponse(createdUser);

    return {
      id: mappedUser._id,
      firstName: mappedUser.firstName,
      lastName: mappedUser.lastName,
      email: mappedUser.email,
      role: mappedUser.role,
      status: mappedUser.status,
      shiftId: mappedUser.shiftId,
      createdAt: mappedUser.createdAt,
    };
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Email already exists');
    }
    throw error;
  }
}

async function getUsers() {
  const users = await usersRepository.findAll();
  return mapUsersResponse(users);
}

async function getUserById(id) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return mapUserResponse(user);
}

async function updateUserByAdmin(id, payload) {
  const existingUser = await usersRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const allowedFields = ['firstName', 'lastName', 'phone', 'status'];
  const updateData = {};

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  }

  if (payload.role !== undefined) {
    updateData.roleId = await resolveRoleId(payload.role);
  }

  if (payload.shiftId !== undefined) {
    if (payload.shiftId === null) {
      updateData.shiftId = null;
    } else {
      const shift = await shiftsRepository.findShiftById(payload.shiftId);
      if (!shift) {
        throw new ApiError(404, 'Shift not found');
      }
      updateData.shiftId = payload.shiftId;
    }
  }

  const updatedUser = await usersRepository.updateById(id, updateData);
  return mapUserResponse(updatedUser);
}

async function deleteUserByAdmin(id) {
  const existingUser = await usersRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const roleName = existingUser.roleId?.name;
  if (roleName === SYSTEM_ADMIN_ROLE) {
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
  return mapUserResponse(updatedUser);
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUserStatusByAdmin,
};
