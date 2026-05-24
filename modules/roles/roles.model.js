const mongoose = require('mongoose');
const { ALL_PERMISSIONS, WILDCARD_PERMISSION } = require('../../shared/constants/permissions');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    permissions: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.every((permission) => {
            if (permission === WILDCARD_PERMISSION) {
              return true;
            }
            return ALL_PERMISSIONS.includes(permission);
          });
        },
        message: 'Invalid permission',
      },
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Role', roleSchema);
