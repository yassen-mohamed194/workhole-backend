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

function resolveEffectivePermissions(req) {
  return req.user?.permissions || [];
}

module.exports = {
  hasPermission,
  resolveEffectivePermissions,
};
