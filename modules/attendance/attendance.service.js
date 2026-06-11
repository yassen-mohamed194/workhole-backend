const config = require('../../config');
const ApiError = require('../../shared/utils/ApiError');
const usersRepository = require('../users/users.repository');
const attendanceRepository = require('./attendance.repository');
const officeRepository = require('./office.repository');
const {
  getStartOfDay,
  getEndOfDay,
  determineAttendanceStatus,
  isEarlyCheckout,
  calculateDistanceMeters,
  calculateWorkMinutes,
  buildMonthDateRange,
} = require('./attendance.utils');

async function getUserWithShift(userId) {
  const user = await usersRepository.findByIdWithShift(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.shiftId) {
    throw new ApiError(400, 'User has no assigned shift');
  }

  return user;
}

async function resolveOfficeLocation(lat, lng) {
  const offices = await officeRepository.findAllOffices();
  let nearestOffice = null;
  let nearestDistance = Infinity;

  for (const office of offices) {
    const distance = calculateDistanceMeters(lat, lng, office.lat, office.lng);

    if (distance <= config.officeRadiusMeters && distance < nearestDistance) {
      nearestOffice = office;
      nearestDistance = distance;
    }
  }

  if (nearestOffice) {
    return {
      locationType: 'office',
      officeId: nearestOffice._id,
      officeName: nearestOffice.name,
    };
  }

  return {
    locationType: 'remote',
    officeId: null,
    officeName: null,
  };
}

function buildAttendanceLocationFields(location) {
  return {
    locationType: location.locationType,
    officeId: location.officeId,
    officeName: location.officeName,
  };
}

async function createOffice(payload) {
  const office = await officeRepository.createOffice({
    name: String(payload.name).trim(),
    lat: payload.lat,
    lng: payload.lng,
  });

  return office.toObject();
}

async function getOffices() {
  return officeRepository.findAllOffices();
}

async function checkIn(userId, payload) {
  const user = await getUserWithShift(userId);
  const shift = user.shiftId;

  const today = getStartOfDay();
  const existingAttendance = await attendanceRepository.findAttendanceByUserAndDate(userId, today);

  if (existingAttendance?.checkInTime) {
    throw new ApiError(409, 'Already checked in for today');
  }

  const checkInTime = new Date();
  const location = await resolveOfficeLocation(payload.lat, payload.lng);
  const status = determineAttendanceStatus(checkInTime, shift, config.attendanceGraceMinutes);
  const locationFields = buildAttendanceLocationFields(location);

  const attendanceData = {
    checkInTime,
    checkInLat: payload.lat,
    checkInLng: payload.lng,
    status,
    ...locationFields,
  };

  if (existingAttendance) {
    return attendanceRepository.updateAttendanceById(existingAttendance._id, attendanceData);
  }

  const attendance = await attendanceRepository.createAttendance({
    userId,
    date: today,
    ...attendanceData,
  });

  return attendance.toObject();
}

async function checkOut(userId, payload) {
  const user = await getUserWithShift(userId);
  const shift = user.shiftId;

  const today = getStartOfDay();
  const attendance = await attendanceRepository.findAttendanceByUserAndDate(userId, today);

  if (!attendance || !attendance.checkInTime) {
    throw new ApiError(400, 'Check-in is required before check-out');
  }

  if (attendance.checkOutTime) {
    throw new ApiError(409, 'Already checked out for today');
  }

  const checkOutTime = new Date();
  const totalWorkMinutes = calculateWorkMinutes(new Date(attendance.checkInTime), checkOutTime);
  const earlyCheckout = isEarlyCheckout(checkOutTime, shift);

  return attendanceRepository.updateAttendanceById(attendance._id, {
    checkOutTime,
    checkOutLat: payload.lat,
    checkOutLng: payload.lng,
    totalWorkMinutes,
    earlyCheckout,
  });
}

async function getTodayAttendance(userId) {
  const today = getStartOfDay();
  return attendanceRepository.findAttendanceByUser(userId, today);
}

async function getAttendanceHistory(userId, query) {
  return attendanceRepository.findAttendanceHistory(userId, query);
}

async function getAttendanceLogs(query) {
  const { from, to, ...rest } = query;

  return attendanceRepository.findAttendanceLogs({
    ...rest,
    from: from ? getStartOfDay(from) : undefined,
    to: to ? getEndOfDay(to) : undefined,
  });
}

async function getAttendanceById(id) {
  const attendance = await attendanceRepository.findAttendanceById(id);

  if (!attendance) {
    throw new ApiError(404, 'Attendance not found');
  }

  return attendance;
}

async function getAttendanceSummary(userId) {
  return attendanceRepository.findAttendanceSummary(userId);
}

async function getMonthlyAttendanceSummary(userId, month, year) {
  const { from, to } = buildMonthDateRange(month, year);
  const summary = await attendanceRepository.findAttendanceSummary(userId, { from, to });

  return {
    month,
    year,
    ...summary,
  };
}

module.exports = {
  createOffice,
  getOffices,
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceLogs,
  getAttendanceById,
  getAttendanceSummary,
  getMonthlyAttendanceSummary,
};
