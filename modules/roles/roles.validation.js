const { z } = require('zod');
const mongoose = require('mongoose');
const { ALL_PERMISSIONS, WILDCARD_PERMISSION } = require('../../shared/constants/permissions');

const permissionValueSchema = z
  .string()
  .refine((value) => ALL_PERMISSIONS.includes(value), {
    message: 'Invalid permission',
  })
  .refine((value) => value !== WILDCARD_PERMISSION, {
    message: 'Invalid permission',
  });

const createRoleSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  permissions: z.array(permissionValueSchema).min(1, 'permissions are required'),
});

const updateRoleSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').optional(),
    permissions: z.array(permissionValueSchema).min(1, 'permissions cannot be empty').optional(),
  })
  .refine((data) => data.name !== undefined || data.permissions !== undefined, {
    message: 'At least one field is required',
  });

const getRoleByIdParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid role id',
  }),
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  getRoleByIdParamsSchema,
};
