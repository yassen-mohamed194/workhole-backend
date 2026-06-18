const Role = require('../../modules/roles/roles.model');
const User = require('../../modules/users/users.model');
const CompanyMember = require('../../modules/companies/companyMember.model');
const {
  PERMISSIONS,
  WILDCARD_PERMISSION,
  SYSTEM_ADMIN_ROLE,
  SYSTEM_EMPLOYEE_ROLE,
} = require('../constants/permissions');

const SYSTEM_ROLES = [
  {
    name: SYSTEM_ADMIN_ROLE,
    permissions: [WILDCARD_PERMISSION],
    isSystem: true,
  },
  {
    name: SYSTEM_EMPLOYEE_ROLE,
    permissions: [
      PERMISSIONS.ATTENDANCE_CHECKIN,
      PERMISSIONS.ATTENDANCE_CHECKOUT,
      PERMISSIONS.ATTENDANCE_HISTORY,
      PERMISSIONS.BREAKS_START,
      PERMISSIONS.BREAKS_END,
      PERMISSIONS.BREAKS_READ,
      PERMISSIONS.BREAKS_HISTORY,
      PERMISSIONS.BREAKS_SUMMARY,
    ],
    isSystem: true,
  },
];

async function ensureSystemRoles() {
  for (const roleData of SYSTEM_ROLES) {
    await Role.findOneAndUpdate(
      { name: roleData.name },
      { $set: roleData },
      { upsert: true, returnDocument: 'after' }
    );
  }
}

async function migrateLegacyUserRoles() {
  const adminRole = await Role.findOne({ name: SYSTEM_ADMIN_ROLE }).lean();
  const employeeRole = await Role.findOne({ name: SYSTEM_EMPLOYEE_ROLE }).lean();

  if (!adminRole || !employeeRole) {
    return;
  }

  const users = await User.collection.find({
    $or: [{ roleId: { $exists: false } }, { roleId: null }],
  }).toArray();

  for (const user of users) {
    const legacyRole = user.role === SYSTEM_ADMIN_ROLE ? SYSTEM_ADMIN_ROLE : SYSTEM_EMPLOYEE_ROLE;
    const roleId = legacyRole === SYSTEM_ADMIN_ROLE ? adminRole._id : employeeRole._id;

    await User.collection.updateOne(
      { _id: user._id },
      {
        $set: { roleId },
        $unset: { role: '' },
      }
    );
  }
}

/**
 * Copies legacy User.roleId into CompanyMember.roleId when membership role is missing.
 * Ensures existing permissions are preserved on the company-scoped model.
 */
async function migrateMembershipRolesFromUsers() {
  const membersMissingRole = await CompanyMember.collection
    .find({
      $or: [{ roleId: { $exists: false } }, { roleId: null }],
    })
    .toArray();

  for (const member of membersMissingRole) {
    const user = await User.findById(member.userId).select('roleId').lean();
    if (!user?.roleId) {
      continue;
    }

    await CompanyMember.collection.updateOne(
      { _id: member._id },
      { $set: { roleId: user.roleId } }
    );
  }
}

async function seedRoles() {
  await ensureSystemRoles();
  await migrateLegacyUserRoles();
  await migrateMembershipRolesFromUsers();
}

module.exports = seedRoles;
