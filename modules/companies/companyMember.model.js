const mongoose = require('mongoose');

const COMPANY_MEMBER_STATUSES = ['active', 'inactive', 'pending'];

const companyMemberSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Source of truth for role ownership within a company (replaces User.roleId per company).
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    status: {
      type: String,
      enum: COMPANY_MEMBER_STATUSES,
      default: 'active',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

companyMemberSchema.index({ companyId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CompanyMember', companyMemberSchema);
