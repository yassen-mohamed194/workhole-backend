const mongoose = require('mongoose');

const LOCATION_TYPES = ['office', 'remote'];
const ATTENDANCE_STATUSES = ['present', 'late', 'absent'];

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    checkInLat: {
      type: Number,
      default: null,
    },
    checkInLng: {
      type: Number,
      default: null,
    },
    checkOutLat: {
      type: Number,
      default: null,
    },
    checkOutLng: {
      type: Number,
      default: null,
    },
    locationType: {
      type: String,
      enum: LOCATION_TYPES,
      default: null,
    },
    officeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Office',
      default: null,
    },
    officeName: {
      type: String,
      default: null,
      trim: true,
    },
    totalWorkMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      default: 'present',
      index: true,
    },
    earlyCheckout: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
