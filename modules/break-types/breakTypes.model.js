const mongoose = require('mongoose');

const breakTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: [1, 'durationMinutes must be greater than 0'],
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: 'durationMinutes must be an integer',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('BreakType', breakTypeSchema);
