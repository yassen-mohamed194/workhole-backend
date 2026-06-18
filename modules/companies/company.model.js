const mongoose = require('mongoose');

const COMPANY_STATUSES = ['active', 'inactive', 'suspended'];
const CODE_PATTERN = /^\S+$/;

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'name must be at least 2 characters'],
    },
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(value) {
          return CODE_PATTERN.test(value);
        },
        message: 'code must not contain spaces',
      },
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: COMPANY_STATUSES,
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

companySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Company', companySchema);
