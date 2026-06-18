// LEGACY: maps User.roleId to API role name. Company-scoped roles live on CompanyMember.
function getRoleName(user) {
  if (user.roleId && typeof user.roleId === 'object' && user.roleId.name) {
    return user.roleId.name;
  }

  return undefined;
}

function mapUserResponse(user) {
  if (!user) {
    return user;
  }

  const plainUser = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  const role = getRoleName(plainUser);

  delete plainUser.roleId;

  if (role) {
    plainUser.role = role;
  }

  return plainUser;
}

function mapUsersResponse(users) {
  return users.map((user) => mapUserResponse(user));
}

module.exports = {
  mapUserResponse,
  mapUsersResponse,
};
