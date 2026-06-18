const { z } = require('zod');
const mongoose = require('mongoose');

const COMPANY_STATUSES = ['active', 'inactive', 'suspended'];
const CODE_PATTERN = /^\S+$/;

const companyCodeSchema = z
  .string()
  .trim()
  .min(1, 'code is required')
  .regex(CODE_PATTERN, 'code must not contain spaces')
  .transform((value) => value.toLowerCase());

const optionalEmailSchema = z.string().trim().email('Invalid email').optional();

const createCompanySchema = z.object({
  name: z.string().trim().min(2, 'name must be at least 2 characters'),
  code: companyCodeSchema,
  email: optionalEmailSchema,
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  logo: z.string().trim().optional(),
  status: z.enum(COMPANY_STATUSES).optional(),
});

const updateCompanySchema = z
  .object({
    name: z.string().trim().min(2, 'name must be at least 2 characters').optional(),
    code: companyCodeSchema.optional(),
    email: optionalEmailSchema,
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    logo: z.string().trim().optional(),
    status: z.enum(COMPANY_STATUSES).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.code !== undefined ||
      data.email !== undefined ||
      data.phone !== undefined ||
      data.address !== undefined ||
      data.logo !== undefined ||
      data.status !== undefined,
    {
      message: 'At least one field is required',
    }
  );

const getCompanyByIdParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid company id',
  }),
});

module.exports = {
  createCompanySchema,
  updateCompanySchema,
  getCompanyByIdParamsSchema,
};
