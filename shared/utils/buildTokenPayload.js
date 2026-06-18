// LEGACY: builds JWT from User.roleId. Will switch to CompanyMember.roleId in a future auth phase.
function buildTokenPayload(user) {
  const role = user.roleId;

  if (!role) {
    throw new Error('User role must be populated before building token payload');
  }

  const roleId = role._id ?? role;
  const permissions = role.permissions ?? [];

  return {
    id: user._id,
    roleId,
    permissions,
  };
}

module.exports = buildTokenPayload;
