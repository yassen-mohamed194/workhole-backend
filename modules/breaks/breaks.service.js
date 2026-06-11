const ApiError = require('../../shared/utils/ApiError');
const { WILDCARD_PERMISSION } = require('../../shared/constants/permissions');
const attendanceRepository = require('../attendance/attendance.repository');
const { getStartOfDay, getEndOfDay } = require('../attendance/attendance.utils');
const breakTypesRepository = require('../break-types/breakTypes.repository');
const breaksRepository = require('./breaks.repository');

function calculateDurationMinutes(startTime, endTime) {
  const diffMs = endTime.getTime() - new Date(startTime).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

function mapBreakLog(breakRecord) {
  const { breakTypeId, ...rest } = breakRecord;

  return {
    ...rest,
    breakType: breakTypeId || null,
    isExceeded: Number(rest.exceed || 0) > 0,
  };
}

function canAccessAnyBreak(user) {
  return Array.isArray(user.permissions) && user.permissions.includes(WILDCARD_PERMISSION);
}

async function getOpenAttendanceForToday(userId) {
  const today = getStartOfDay();
  const attendance = await attendanceRepository.findAttendanceByUserAndDate(userId, today);

  if (!attendance || !attendance.checkInTime) {
    throw new ApiError(400, 'Attendance today is required before starting a break');
  }

  if (attendance.checkOutTime) {
    throw new ApiError(400, 'Cannot manage breaks after check-out');
  }

  return attendance;
}

async function startBreak(userId, payload) {
  const attendance = await getOpenAttendanceForToday(userId);
  const breakType = await breakTypesRepository.findBreakTypeById(payload.breakTypeId);

  if (!breakType) {
    throw new ApiError(404, 'Break type not found');
  }

  if (!breakType.isActive) {
    throw new ApiError(400, 'Break type is inactive');
  }

  const activeBreak = await breaksRepository.findActiveBreakByUser(userId);
  if (activeBreak) {
    throw new ApiError(409, 'Active break already exists');
  }

  try {
    const breakRecord = await breaksRepository.createBreak({
      userId,
      attendanceId: attendance._id,
      breakTypeId: breakType._id,
      startTime: new Date(),
      allowedMinutes: breakType.durationMinutes,
      status: 'active',
    });

    return breakRecord.toObject();
  } catch (error) {
    if (error && error.code === 11000) {
      throw new ApiError(409, 'Active break already exists');
    }
    throw error;
  }
}

async function endBreak(userId) {
  await getOpenAttendanceForToday(userId);

  const activeBreak = await breaksRepository.findActiveBreakByUser(userId);
  if (!activeBreak) {
    throw new ApiError(400, 'No active break exists');
  }

  const endTime = new Date();
  const durationMinutes = calculateDurationMinutes(activeBreak.startTime, endTime);
  const allowedMinutes = activeBreak.allowedMinutes;
  const exceed = Math.max(0, durationMinutes - allowedMinutes);

  const completedBreak = await breaksRepository.completeBreakById(activeBreak._id, {
    endTime,
    durationMinutes,
    allowedMinutes,
    exceed,
  });

  if (!completedBreak) {
    throw new ApiError(404, 'Break not found');
  }

  return completedBreak;
}

async function getTodayBreaks(userId) {
  const items = await breaksRepository.findTodayBreaks(userId, {
    from: getStartOfDay(),
    to: getEndOfDay(),
  });

  return {
    totalBreaks: items.length,
    totalMinutes: items.reduce((total, item) => total + Number(item.durationMinutes || 0), 0),
    exceededBreaks: items.filter((item) => Number(item.exceed || 0) > 0).length,
    items: items.map(mapBreakLog),
  };
}

async function getBreakHistory(userId, query) {
  const { from, to, ...rest } = query;
  const result = await breaksRepository.findBreakHistory(userId, {
    ...rest,
    from: from ? getStartOfDay(from) : undefined,
    to: to ? getEndOfDay(to) : undefined,
  });

  return {
    ...result,
    items: result.items.map(mapBreakLog),
  };
}

async function getBreakById(id, user) {
  const breakRecord = await breaksRepository.findBreakById(id);

  if (!breakRecord) {
    throw new ApiError(404, 'Break not found');
  }

  if (!canAccessAnyBreak(user) && String(breakRecord.userId) !== String(user.id)) {
    throw new ApiError(403, 'Forbidden');
  }

  return mapBreakLog(breakRecord);
}

async function getBreakSummary(userId) {
  return breaksRepository.findBreakSummary(userId);
}

module.exports = {
  startBreak,
  endBreak,
  getTodayBreaks,
  getBreakHistory,
  getBreakById,
  getBreakSummary,
};
