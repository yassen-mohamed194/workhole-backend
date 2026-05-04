const { z } = require('zod');
const mongoose = require('mongoose');

const createUserSchema = z.object({
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'employee']).optional(),
  shiftId: z.string().optional(),
});

const getUserByIdParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid user id',
  }),
});

module.exports = {
  createUserSchema,
  getUserByIdParamsSchema,
};
