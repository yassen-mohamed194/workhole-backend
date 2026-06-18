const ApiError = require('../utils/ApiError');
const membershipService = require('../services/membership.service');
const { hasPermission, resolveEffectivePermissions } = require('../utils/permissionUtils');

/**
 * Permission gate middleware.
 *
 * Phase 2.2.1 preparation:
 * - Authorization still uses JWT permissions (legacy User.roleId).
 * - When req.params.companyId is present, req.companyContext is populated from
 *   CompanyMember.roleId for future company-scoped RBAC (not yet used for checks).
 */
function authorizePermissions(...requiredPermissions) {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    const companyId = req.params?.companyId;
    if (companyId && req.user.id) {
      try {
        req.companyContext = await membershipService.buildCompanyContext(companyId, req.user.id);
      } catch {
        req.companyContext = null;
      }
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
