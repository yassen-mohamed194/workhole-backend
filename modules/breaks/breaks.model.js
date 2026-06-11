const mongoose = require('mongoose');

const BREAK_STATUSES = ['active', 'completed'];

const breakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: true,
      index: true,
    },
    breakTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BreakType',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    allowedMinutes: {
      type: Number,
      required: true,
      min: 0,
    },
    exceed: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: BREAK_STATUSES,
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

breakSchema.index({ createdAt: -1 });
breakSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);
breakSchema.index({ userId: 1, startTime: -1 });
breakSchema.index({ userId: 1, breakTypeId: 1, startTime: -1 });

module.exports = mongoose.model('Break', breakSchema);
