const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const attendanceController = require('./attendance.controller');
const {
  createOfficeSchema,
  checkInSchema,
  checkOutSchema,
  attendanceHistoryQuerySchema,
  attendanceLogsQuerySchema,
  monthlySummaryQuerySchema,
  getAttendanceByIdParamsSchema,
} = require('./attendance.validation');

const router = Router();

/**
 * @swagger
 * /api/attendance/office:
 *   post:
 *     tags: [Attendance]
 *     summary: Create an office location
 *     description: Registers an office location for geo-based attendance. Requires `attendance.office.manage` permission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfficeRequest'
 *     responses:
 *       201:
 *         description: Office created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithOffice'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  '/office',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_OFFICE_MANAGE),
  validate(createOfficeSchema),
  attendanceController.createOffice
);

/**
 * @swagger
 * /api/attendance/office:
 *   get:
 *     tags: [Attendance]
 *     summary: Get all office locations
 *     description: Returns all registered office locations. Requires `attendance.office.manage` permission.
 *     responses:
 *       200:
 *         description: Offices fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithOffices'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/office',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_OFFICE_MANAGE),
  attendanceController.getOffices
);

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     tags: [Attendance]
 *     summary: Check in for today
 *     description: Records a check-in for the authenticated user. Requires assigned shift and `attendance.checkin` permission. Status is determined from shift start time and `ATTENDANCE_GRACE_MINUTES`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckInRequest'
 *     responses:
 *       200:
 *         description: Check-in recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendance'
 *       400:
 *         description: User has no assigned shift or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Already checked in for today
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/check-in',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_CHECKIN),
  validate(checkInSchema),
  attendanceController.checkIn
);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     tags: [Attendance]
 *     summary: Check out for today
 *     description: Records a check-out for the authenticated user. Requires assigned shift and `attendance.checkout` permission. Sets `earlyCheckout` when leaving before shift end.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckOutRequest'
 *     responses:
 *       200:
 *         description: Check-out recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendance'
 *       400:
 *         description: Check-in is required before check-out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Already checked out for today
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/check-out',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_CHECKOUT),
  validate(checkOutSchema),
  attendanceController.checkOut
);

/**
 * @swagger
 * /api/attendance/today:
 *   get:
 *     tags: [Attendance]
 *     summary: Get today's attendance
 *     description: Returns today's attendance record for the authenticated user. Requires `attendance.history` permission.
 *     responses:
 *       200:
 *         description: Today's attendance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendanceNullable'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/today',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_HISTORY),
  attendanceController.getTodayAttendance
);

/**
 * @swagger
 * /api/attendance/history:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance history
 *     description: Returns paginated attendance history for the authenticated user, sorted newest first. Requires `attendance.history` permission.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Attendance history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendanceHistory'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/history',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_HISTORY),
  validate(attendanceHistoryQuerySchema, 'query'),
  attendanceController.getAttendanceHistory
);

/**
 * @swagger
 * /api/attendance/logs:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance logs
 *     description: Returns paginated attendance logs for all users. Requires `attendance.read` permission.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user MongoDB ObjectId
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, late, absent]
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (inclusive)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (inclusive)
 *     responses:
 *       200:
 *         description: Attendance logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendanceLogs'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/logs',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_READ),
  validate(attendanceLogsQuerySchema, 'query'),
  attendanceController.getAttendanceLogs
);

/**
 * @swagger
 * /api/attendance/summary:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance summary
 *     description: Returns lifetime attendance summary for the authenticated user. Requires `attendance.history` permission.
 *     responses:
 *       200:
 *         description: Attendance summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendanceSummary'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/summary',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_HISTORY),
  attendanceController.getAttendanceSummary
);

/**
 * @swagger
 * /api/attendance/summary/month:
 *   get:
 *     tags: [Attendance]
 *     summary: Get monthly attendance summary
 *     description: Returns attendance summary for a specific month and year for the authenticated user. Requires `attendance.history` permission.
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 6
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1970
 *           maximum: 2100
 *         example: 2026
 *     responses:
 *       200:
 *         description: Monthly attendance summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithMonthlyAttendanceSummary'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/summary/month',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_HISTORY),
  validate(monthlySummaryQuerySchema, 'query'),
  attendanceController.getMonthlyAttendanceSummary
);

/**
 * @swagger
 * /api/attendance/{id}:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance by ID
 *     description: Returns a single attendance record by ID. Requires `attendance.read` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithAttendance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ATTENDANCE_READ),
  validate(getAttendanceByIdParamsSchema, 'params'),
  attendanceController.getAttendanceById
);

module.exports = router;
