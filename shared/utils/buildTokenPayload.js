function normalizeId(value) {
  const id = value?._id ?? value;
  return id ? String(id) : null;
}

function buildTokenPayload(user, company, membership) {
  const role = membership?.roleId;

  if (!role) {
    throw new Error('CompanyMember.roleId must be populated before building token payload');
  }

  const permissions = role.permissions ?? [];

  return {
    id: normalizeId(user),
    companyId: normalizeId(company),
    membershipId: normalizeId(membership),
    roleId: normalizeId(role),
    permissions,
  };
}

module.exports = buildTokenPayload;
