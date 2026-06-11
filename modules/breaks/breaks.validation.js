const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid id',
});

const breakTypeIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid break type id',
});

const startBreakSchema = z.object({
  breakTypeId: breakTypeIdSchema,
});

const breakHistoryQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    breakTypeId: breakTypeIdSchema.optional(),
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: 'from must be before or equal to to',
  });

const getBreakByIdParamsSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  startBreakSchema,
  breakHistoryQuerySchema,
  getBreakByIdParamsSchema,
};
