const companyMemberRepository = require('../../modules/companies/companyMember.repository');
const rolesRepository = require('../../modules/roles/roles.repository');

/**
 * Returns the company membership for a user, with populated userId and roleId.
 */
async function getUserMembership(companyId, userId) {
  return companyMemberRepository.findCompanyMember(companyId, userId);
}

/**
 * Resolves the effective role for a user within a company.
 */
async function getUserRoleInCompany(companyId, userId) {
  const membership = await getUserMembership(companyId, userId);
  return membership?.roleId ?? null;
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
