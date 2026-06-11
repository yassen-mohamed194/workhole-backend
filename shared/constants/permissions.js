const PERMISSIONS = {
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  ROLES_MANAGE: 'roles.manage',

  SHIFTS_CREATE: 'shifts.create',
  SHIFTS_READ: 'shifts.read',
  SHIFTS_UPDATE: 'shifts.update',
  SHIFTS_DELETE: 'shifts.delete',

  ATTENDANCE_OFFICE_MANAGE: 'attendance.office.manage',
  ATTENDANCE_CHECKIN: 'attendance.checkin',
  ATTENDANCE_CHECKOUT: 'attendance.checkout',
  ATTENDANCE_HISTORY: 'attendance.history',
  ATTENDANCE_READ: 'attendance.read',

  BREAKS_START: 'breaks.start',
  BREAKS_END: 'breaks.end',
  BREAKS_READ: 'breaks.read',
  BREAKS_HISTORY: 'breaks.history',
  BREAKS_SUMMARY: 'breaks.summary',

  BREAK_TYPES_CREATE: 'break-types.create',
  BREAK_TYPES_READ: 'break-types.read',
  BREAK_TYPES_UPDATE: 'break-types.update',
  BREAK_TYPES_DELETE: 'break-types.delete',
};

const ALL_PERMISSIONS = Object.freeze(Object.values(PERMISSIONS));

const WILDCARD_PERMISSION = '*';

const SYSTEM_ADMIN_ROLE = 'admin';
const SYSTEM_EMPLOYEE_ROLE = 'employee';

module.exports = {
  PERMISSIONS,
  ALL_PERMISSIONS,
  WILDCARD_PERMISSION,
  SYSTEM_ADMIN_ROLE,
  SYSTEM_EMPLOYEE_ROLE,
};
