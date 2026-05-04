const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', usersSchema);
