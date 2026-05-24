const ApiError = require('../../shared/utils/ApiError');
const { SYSTEM_ADMIN_ROLE } = require('../../shared/constants/permissions');
const usersRepository = require('../users/users.repository');
const rolesRepository = require('./roles.repository');

function normalizeRoleName(name) {
  return String(name).trim().toLowerCase();
}

async function createRole(payload) {
  const name = normalizeRoleName(payload.name);
  const existingRole = await rolesRepository.findRoleByName(name);

  if (existingRole) {
    throw new ApiError(409, 'Role already exists');
  }

  const role = await rolesRepository.createRole({
    name,
    permissions: payload.permissions,
    isSystem: false,
  });

  return role.toObject();
}

async function getRoles() {
  return rolesRepository.findAllRoles();
}

async function getRoleById(id) {
  const role = await rolesRepository.findRoleById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  return role;
}

async function updateRoleById(id, payload) {
  const existingRole = await rolesRepository.findRoleById(id);
  if (!existingRole) {
    throw new ApiError(404, 'Role not found');
  }

  if (existingRole.name === SYSTEM_ADMIN_ROLE) {
    if (payload.name !== undefined && normalizeRoleName(payload.name) !== SYSTEM_ADMIN_ROLE) {
      throw new ApiError(403, 'Cannot modify system admin role');
    }

    if (payload.permissions !== undefined) {
      throw new ApiError(403, 'Cannot modify system admin role');
    }
  }

  const updateData = {};

  if (payload.name !== undefined) {
    const name = normalizeRoleName(payload.name);
    if (name !== existingRole.name) {
      const duplicateRole = await rolesRepository.findRoleByName(name);
      if (duplicateRole && String(duplicateRole._id) !== String(existingRole._id)) {
        throw new ApiError(409, 'Role already exists');
      }
      updateData.name = name;
    }
  }

  if (payload.permissions !== undefined) {
    updateData.permissions = payload.permissions;
  }

  if (Object.keys(updateData).length === 0) {
    return existingRole;
  }

  const updatedRole = await rolesRepository.updateRoleById(id, updateData);
  if (!updatedRole) {
    throw new ApiError(404, 'Role not found');
  }

  return updatedRole;
}

async function deleteRoleById(id) {
  const existingRole = await rolesRepository.findRoleById(id);
  if (!existingRole) {
    throw new ApiError(404, 'Role not found');
  }

  if (existingRole.isSystem) {
    throw new ApiError(403, 'Cannot delete system role');
  }

  const assignedUsersCount = await usersRepository.countByRoleId(id);
  if (assignedUsersCount > 0) {
    throw new ApiError(409, 'Role is assigned to users');
  }

  await rolesRepository.deleteRoleById(id);

  return {
    message: 'Role deleted successfully',
  };
}

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
