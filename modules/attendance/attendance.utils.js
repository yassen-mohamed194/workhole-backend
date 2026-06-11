function getStartOfDay(date = new Date()) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

function getEndOfDay(date = new Date()) {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

function parseTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildShiftDateTime(baseDate, timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const dateTime = new Date(baseDate);
  dateTime.setUTCHours(hours, minutes, 0, 0);
  return dateTime;
}

function getShiftEndDateTime(baseDate, shift) {
  const shiftEnd = buildShiftDateTime(baseDate, shift.endTime);

  if (shift.isNightShift && parseTimeToMinutes(shift.endTime) <= parseTimeToMinutes(shift.startTime)) {
    shiftEnd.setUTCDate(shiftEnd.getUTCDate() + 1);
  }

  return shiftEnd;
}

function determineAttendanceStatus(checkInTime, shift, graceMinutes) {
  const baseDate = getStartOfDay(checkInTime);
  const shiftStart = buildShiftDateTime(baseDate, shift.startTime);
  const graceDeadline = new Date(shiftStart.getTime() + graceMinutes * 60000);

  return checkInTime <= graceDeadline ? 'present' : 'late';
}

function isEarlyCheckout(checkOutTime, shift) {
  const baseDate = getStartOfDay(checkOutTime);
  const shiftEnd = getShiftEndDateTime(baseDate, shift);

  return checkOutTime < shiftEnd;
}

function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
  const earthRadiusMeters = 6371000;
  const toRadians = (value) => (value * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const originLat = toRadians(lat1);
  const targetLat = toRadians(lat2);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function calculateWorkMinutes(checkInTime, checkOutTime) {
  const diffMs = checkOutTime.getTime() - checkInTime.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

function buildMonthDateRange(month, year) {
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { from, to };
}

module.exports = {
  getStartOfDay,
  getEndOfDay,
  parseTimeToMinutes,
  buildShiftDateTime,
  getShiftEndDateTime,
  determineAttendanceStatus,
  isEarlyCheckout,
  calculateDistanceMeters,
  calculateWorkMinutes,
  buildMonthDateRange,
};
