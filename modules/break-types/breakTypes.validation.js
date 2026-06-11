const { z } = require('zod');
const mongoose = require('mongoose');

const positiveIntSchema = z
  .number()
  .int('durationMinutes must be an integer')
  .min(1, 'durationMinutes must be greater than 0');

const createBreakTypeSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  durationMinutes: positiveIntSchema,
});

const updateBreakTypeSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').optional(),
    durationMinutes: positiveIntSchema.optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.durationMinutes !== undefined,
    {
      message: 'At least one field is required',
    }
  );

const getBreakTypeByIdParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid break type id',
  }),
});

module.exports = {
  createBreakTypeSchema,
  updateBreakTypeSchema,
  getBreakTypeByIdParamsSchema,
};
