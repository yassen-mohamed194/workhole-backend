const { WILDCARD_PERMISSION } = require('../constants/permissions');

function hasPermission(userPermissions, requiredPermission) {
  if (!Array.isArray(userPermissions)) {
    return false;
  }

  if (userPermissions.includes(WILDCARD_PERMISSION)) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
}

/**
 * Resolves permissions used for route authorization.
 *
 * Phase 2.2.1: JWT permissions (from legacy User.roleId) remain authoritative.
 * Future company-scoped RBAC will prefer req.companyContext.permissions when enabled.
 */
function resolveEffectivePermissions(req) {
  return req.user?.permissions || [];
}

module.exports = {
  hasPermission,
  resolveEffectivePermissions,
};
