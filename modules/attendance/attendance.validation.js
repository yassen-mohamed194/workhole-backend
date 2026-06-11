const { z } = require('zod');
const mongoose = require('mongoose');

const ATTENDANCE_STATUSES = ['present', 'late', 'absent'];

const coordinateSchema = z
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90');

const longitudeSchema = z
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid id',
});

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const createOfficeSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  lat: coordinateSchema,
  lng: longitudeSchema,
});

const checkInSchema = z.object({
  lat: coordinateSchema,
  lng: longitudeSchema,
});

const checkOutSchema = z.object({
  lat: coordinateSchema,
  lng: longitudeSchema,
});

const attendanceHistoryQuerySchema = paginationQuerySchema;

const attendanceLogsQuerySchema = paginationQuerySchema.extend({
  userId: objectIdSchema.optional(),
  status: z.enum(ATTENDANCE_STATUSES).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

const monthlySummaryQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1970).max(2100),
});

const getAttendanceByIdParamsSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createOfficeSchema,
  checkInSchema,
  checkOutSchema,
  attendanceHistoryQuerySchema,
  attendanceLogsQuerySchema,
  monthlySummaryQuerySchema,
  getAttendanceByIdParamsSchema,
};
