const mongoose = require('mongoose');

const WORKING_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SHIFT_STATUSES = ['active', 'inactive'];
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const shiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return TIME_PATTERN.test(value);
        },
        message: 'startTime must be in HH:mm format',
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return TIME_PATTERN.test(value);
        },
        message: 'endTime must be in HH:mm format',
      },
    },
    workingDays: {
      type: [String],
      required: true,
      validate: {
        validator(value) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((day) => WORKING_DAYS.includes(day))
          );
        },
        message: 'Invalid working day',
      },
    },
    breakDuration: {
      type: Number,
      default: 60,
      min: 0,
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: 'breakDuration must be an integer',
      },
    },
    gracePeriod: {
      type: Number,
      default: 15,
      min: 0,
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: 'gracePeriod must be an integer',
      },
    },
    isNightShift: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: SHIFT_STATUSES,
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Shift', shiftSchema);
