const { z } = require('zod');
const mongoose = require('mongoose');

const COMPANY_MEMBER_STATUSES = ['active', 'inactive', 'pending'];

const objectIdSchema = (fieldName) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `Invalid ${fieldName}`,
  });

const addCompanyMemberSchema = z.object({
  userId: objectIdSchema('userId'),
  roleId: objectIdSchema('roleId'),
});

const updateCompanyMemberSchema = z
  .object({
    roleId: objectIdSchema('roleId').optional(),
    status: z.enum(COMPANY_MEMBER_STATUSES).optional(),
  })
  .refine((data) => data.roleId !== undefined || data.status !== undefined, {
    message: 'At least one field is required',
  });

const companyMemberParamsSchema = z.object({
  companyId: objectIdSchema('companyId'),
  userId: objectIdSchema('userId'),
});

const companyIdParamsSchema = z.object({
  companyId: objectIdSchema('companyId'),
});

module.exports = {
  addCompanyMemberSchema,
  updateCompanyMemberSchema,
  companyMemberParamsSchema,
  companyIdParamsSchema,
};
