const ApiError = require('../utils/ApiError');
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

function authorizePermissions(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    const userPermissions = req.user.permissions || [];
    const allowed = requiredPermissions.every((permission) =>
      hasPermission(userPermissions, permission)
    );

    if (!allowed) {
      return next(new ApiError(403, 'Forbidden'));
    }

    return next();
  };
}

module.exports = authorizePermissions;
