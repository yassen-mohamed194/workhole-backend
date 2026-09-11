const ApiError = require('../utils/ApiError');
const { hasPermission, resolveEffectivePermissions } = require('../utils/permissionUtils');

function authorizePermissions(...requiredPermissions) {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    const userPermissions = resolveEffectivePermissions(req);
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
module.exports.hasPermission = hasPermission;
module.exports.resolveEffectivePermissions = resolveEffectivePermissions;
