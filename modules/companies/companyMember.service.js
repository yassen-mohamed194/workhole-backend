const ApiError = require('../../shared/utils/ApiError');
const membershipService = require('../../shared/services/membership.service');
const usersRepository = require('../users/users.repository');
const rolesRepository = require('../roles/roles.repository');
const companyRepository = require('./company.repository');
const companyMemberRepository = require('./companyMember.repository');

async function assertCompanyExists(companyId) {
  const company = await companyRepository.findCompanyById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  return company;
}

async function assertUserExists(userId) {
  const user = await usersRepository.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

async function assertRoleExists(roleId) {
  const role = await rolesRepository.findRoleById(roleId);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  return role;
}

async function addCompanyMember(companyId, payload) {
  await assertCompanyExists(companyId);
  await assertUserExists(payload.userId);
  await assertRoleExists(payload.roleId);

  const existingMember = await membershipService.getUserMembership(companyId, payload.userId);
  if (existingMember) {
    throw new ApiError(409, 'Membership already exists');
  }

  try {
    const member = await companyMemberRepository.createCompanyMember({
      companyId,
      userId: payload.userId,
      roleId: payload.roleId,
    });

    const populatedMember = await companyMemberRepository.findCompanyMemberById(member._id);
    return populatedMember;
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Membership already exists');
    }
    throw error;
  }
}

async function getCompanyMembers(companyId) {
  await assertCompanyExists(companyId);
  return companyMemberRepository.findCompanyMembers(companyId);
}

async function getCompanyMember(companyId, userId) {
  await assertCompanyExists(companyId);

  const member = await membershipService.getUserMembership(companyId, userId);
  if (!member) {
    throw new ApiError(404, 'Membership not found');
  }

  return member;
}

async function updateCompanyMember(companyId, userId, payload) {
  await assertCompanyExists(companyId);

  const existingMember = await membershipService.getUserMembership(companyId, userId);
  if (!existingMember) {
    throw new ApiError(404, 'Membership not found');
  }

  if (payload.roleId !== undefined) {
    await assertRoleExists(payload.roleId);
  }

  const updateData = {};

  if (payload.roleId !== undefined) {
    updateData.roleId = payload.roleId;
  }

  if (payload.status !== undefined) {
    updateData.status = payload.status;
  }

  if (Object.keys(updateData).length === 0) {
    return existingMember;
  }

  const updatedMember = await companyMemberRepository.updateCompanyMember(companyId, userId, updateData);
  if (!updatedMember) {
    throw new ApiError(404, 'Membership not found');
  }

  return updatedMember;
}

async function deleteCompanyMember(companyId, userId) {
  await assertCompanyExists(companyId);

  const existingMember = await membershipService.getUserMembership(companyId, userId);
  if (!existingMember) {
    throw new ApiError(404, 'Membership not found');
  }

  await companyMemberRepository.deleteCompanyMember(companyId, userId);

  return {
    message: 'Membership removed successfully',
  };
}

module.exports = {
  addCompanyMember,
  getCompanyMembers,
  getCompanyMember,
  updateCompanyMember,
  deleteCompanyMember,
};
