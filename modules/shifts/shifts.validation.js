const { z } = require('zod');
const mongoose = require('mongoose');

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const WORKING_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SHIFT_STATUSES = ['active', 'inactive'];

const timeSchema = z.string().regex(TIME_PATTERN, 'Time must be in HH:mm format');

const workingDaySchema = z.enum(WORKING_DAYS, {
  message: 'Invalid working day',
});

const nonNegativeIntSchema = z
  .number()
  .int('Value must be an integer')
  .min(0, 'Value must be zero or greater');

const createShiftSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  startTime: timeSchema,
  endTime: timeSchema,
  workingDays: z.array(workingDaySchema).min(1, 'workingDays are required'),
  breakDuration: nonNegativeIntSchema.optional(),
  gracePeriod: nonNegativeIntSchema.optional(),
  isNightShift: z.boolean().optional(),
  status: z.enum(SHIFT_STATUSES).optional(),
});

const updateShiftSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    workingDays: z.array(workingDaySchema).min(1, 'workingDays cannot be empty').optional(),
    breakDuration: nonNegativeIntSchema.optional(),
    gracePeriod: nonNegativeIntSchema.optional(),
    isNightShift: z.boolean().optional(),
    status: z.enum(SHIFT_STATUSES).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.startTime !== undefined ||
      data.endTime !== undefined ||
      data.workingDays !== undefined ||
      data.breakDuration !== undefined ||
      data.gracePeriod !== undefined ||
      data.isNightShift !== undefined ||
      data.status !== undefined,
    {
      message: 'At least one field is required',
    }
  );

const updateShiftStatusSchema = z.object({
  status: z.enum(SHIFT_STATUSES),
});

const getShiftByIdParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid shift id',
  }),
});

module.exports = {
  createShiftSchema,
  updateShiftSchema,
  updateShiftStatusSchema,
  getShiftByIdParamsSchema,
};
