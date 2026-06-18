const companyMemberRepository = require('../../modules/companies/companyMember.repository');
const rolesRepository = require('../../modules/roles/roles.repository');
const usersRepository = require('../../modules/users/users.repository');

/**
 * Returns the company membership for a user, with populated userId and roleId.
 */
async function getUserMembership(companyId, userId) {
  return companyMemberRepository.findCompanyMember(companyId, userId);
}

/**
 * Resolves the effective role for a user within a company.
 * CompanyMember.roleId is the source of truth when a membership exists.
 * Falls back to legacy User.roleId when membership is missing or has no role.
 */
async function getUserRoleInCompany(companyId, userId) {
  const membership = await getUserMembership(companyId, userId);

  if (membership?.roleId) {
    return membership.roleId;
  }

  const user = await usersRepository.findById(userId);
  return user?.roleId ?? null;
}

function extractPermissionsFromRole(role) {
  if (!role) {
    return [];
  }

  if (typeof role === 'object' && Array.isArray(role.permissions)) {
    return role.permissions;
  }

  return [];
}

/**
 * Resolves permissions for a user within a company from CompanyMember.roleId.
 * Falls back to legacy User.roleId permissions when membership role is unavailable.
 */
async function getUserPermissionsInCompany(companyId, userId) {
  const role = await getUserRoleInCompany(companyId, userId);
  const permissions = extractPermissionsFromRole(role);

  if (permissions.length > 0 || !role) {
    return permissions;
  }

  const roleId = role._id ?? role;
  const roleDocument = await rolesRepository.findRoleById(roleId);
  return roleDocument?.permissions ?? [];
}

/**
 * Builds company-scoped context for RBAC preparation.
 * Attached to req.companyContext by authorizePermissions when companyId is present.
 */
async function buildCompanyContext(companyId, userId) {
  const membership = await getUserMembership(companyId, userId);
  if (!membership) {
    return null;
  }

  const role = membership.roleId;
  const permissions = await getUserPermissionsInCompany(companyId, userId);

  return {
    companyId,
    userId,
    membership,
    roleId: role?._id ?? role ?? null,
    permissions,
  };
}

module.exports = {
  getUserMembership,
  getUserRoleInCompany,
  getUserPermissionsInCompany,
  buildCompanyContext,
};
