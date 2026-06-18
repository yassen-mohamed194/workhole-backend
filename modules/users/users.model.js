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
    refreshToken: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    // LEGACY: global role reference. Source of truth is moving to CompanyMember.roleId.
    // Kept temporarily for JWT/auth backward compatibility until login/JWT migration (Phase 2.3+).
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false, // remove __v field
  }
);

module.exports = mongoose.model('User', usersSchema);
