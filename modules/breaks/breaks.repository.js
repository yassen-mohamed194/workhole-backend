const mongoose = require('mongoose');
const Break = require('./breaks.model');

function createBreak(payload) {
  return Break.create(payload);
}

function findAllBreaks() {
  return Break.find().sort({ createdAt: -1 }).lean();
}

function findActiveBreakByUser(userId) {
  return Break.findOne({ userId, status: 'active' }).sort({ startTime: -1 }).lean();
}

function findBreakById(id) {
  return Break.findById(id).populate('breakTypeId', 'name durationMinutes isActive').lean();
}

function buildBreakQuery({ userId, from, to, breakTypeId }) {
  const filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (breakTypeId) {
    filter.breakTypeId = breakTypeId;
  }

  if (from || to) {
    filter.startTime = {};
    if (from) {
      filter.startTime.$gte = from;
    }
    if (to) {
      filter.startTime.$lte = to;
    }
  }

  return filter;
}

function findTodayBreaks(userId, { from, to }) {
  return Break.find(buildBreakQuery({ userId, from, to }))
    .populate('breakTypeId', 'name durationMinutes isActive')
    .sort({ startTime: -1 })
    .lean();
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

function findBreakHistory(userId, { page, limit, from, to, breakTypeId }) {
  const pagination = buildPagination(page, limit);
  const filter = buildBreakQuery({ userId, from, to, breakTypeId });

  return Promise.all([
    Break.find(filter)
      .populate('breakTypeId', 'name durationMinutes isActive')
      .sort({ startTime: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Break.countDocuments(filter),
  ]).then(([items, total]) => ({
    items,
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit) || 0,
  }));
}

function findBreakSummary(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return Break.aggregate([
    {
      $match: {
        userId: userObjectId,
      },
    },
    {
      $group: {
        _id: null,
        totalBreaks: { $sum: 1 },
        totalMinutes: { $sum: '$durationMinutes' },
        averageMinutes: { $avg: '$durationMinutes' },
        exceededBreaks: {
          $sum: {
            $cond: [{ $gt: ['$exceed', 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalBreaks: 1,
        totalMinutes: 1,
        averageMinutes: { $floor: '$averageMinutes' },
        exceededBreaks: 1,
        exceededPercentage: {
          $cond: [
            { $gt: ['$totalBreaks', 0] },
            {
              $round: [
                {
                  $multiply: [{ $divide: ['$exceededBreaks', '$totalBreaks'] }, 100],
                },
                2,
              ],
            },
            0,
          ],
        },
      },
    },
  ]).then(
    (results) =>
      results[0] || {
        totalBreaks: 0,
        totalMinutes: 0,
        averageMinutes: 0,
        exceededBreaks: 0,
        exceededPercentage: 0,
      }
  );
}

function completeBreakById(id, data) {
  return Break.findByIdAndUpdate(
    id,
    {
      ...data,
      status: 'completed',
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  ).lean();
}

module.exports = {
  createBreak,
  findAllBreaks,
  findActiveBreakByUser,
  findBreakById,
  findTodayBreaks,
  findBreakHistory,
  findBreakSummary,
  completeBreakById,
};
