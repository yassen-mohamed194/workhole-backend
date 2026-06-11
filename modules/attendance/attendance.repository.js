const Attendance = require('./attendance.model');

function createAttendance(data) {
  return Attendance.create(data);
}

function findAttendanceById(id) {
  return Attendance.findById(id).lean();
}

function findAttendanceByUser(userId, date) {
  return Attendance.findOne({ userId, date }).lean();
}

function findAttendanceByUserAndDate(userId, date) {
  return findAttendanceByUser(userId, date);
}

function updateAttendanceById(id, data) {
  return Attendance.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
}

function buildPagination(page, limit) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}

function findAttendanceHistory(userId, { page, limit }) {
  const pagination = buildPagination(page, limit);
  const filter = { userId };

  return Promise.all([
    Attendance.find(filter)
      .sort({ date: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]).then(([items, total]) => ({
    items,
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit) || 0,
  }));
}

function buildLogsFilter({ userId, status, from, to }) {
  const filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (status) {
    filter.status = status;
  }

  if (from || to) {
    filter.date = {};
    if (from) {
      filter.date.$gte = from;
    }
    if (to) {
      filter.date.$lte = to;
    }
  }

  return filter;
}

function findAttendanceLogs({ page, limit, userId, status, from, to }) {
  const pagination = buildPagination(page, limit);
  const filter = buildLogsFilter({ userId, status, from, to });

  return Promise.all([
    Attendance.find(filter)
      .sort({ date: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]).then(([items, total]) => ({
    items,
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit) || 0,
  }));
}

function findAttendanceSummary(userId, { from, to } = {}) {
  const match = { userId };

  if (from || to) {
    match.date = {};
    if (from) {
      match.date.$gte = from;
    }
    if (to) {
      match.date.$lte = to;
    }
  }

  return Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0],
          },
        },
        lateDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'late'] }, 1, 0],
          },
        },
        absentDays: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0],
          },
        },
        totalWorkMinutes: { $sum: '$totalWorkMinutes' },
      },
    },
    {
      $project: {
        _id: 0,
        totalDays: 1,
        presentDays: 1,
        lateDays: 1,
        absentDays: 1,
        totalWorkMinutes: 1,
        averageWorkMinutes: {
          $cond: [
            { $gt: ['$totalDays', 0] },
            { $floor: { $divide: ['$totalWorkMinutes', '$totalDays'] } },
            0,
          ],
        },
      },
    },
  ]).then((results) =>
    results[0] || {
      totalDays: 0,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      totalWorkMinutes: 0,
      averageWorkMinutes: 0,
    }
  );
}

module.exports = {
  createAttendance,
  findAttendanceById,
  findAttendanceByUser,
  findAttendanceByUserAndDate,
  updateAttendanceById,
  findAttendanceHistory,
  findAttendanceLogs,
  findAttendanceSummary,
};
