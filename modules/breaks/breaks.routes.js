const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const breaksController = require('./breaks.controller');
const {
  startBreakSchema,
  breakHistoryQuerySchema,
  getBreakByIdParamsSchema,
} = require('./breaks.validation');

const router = Router();

/**
 * @swagger
 * /api/breaks/start:
 *   post:
 *     tags: [Breaks]
 *     summary: Start a break
 *     description: Starts a break for the authenticated user. Requires today's attendance, no check-out, an active break type, and `breaks.start` permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartBreakRequest'
 *     responses:
 *       201:
 *         description: Break started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreak'
 *       400:
 *         description: Attendance missing, checked out, inactive break type, or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Active break already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/start',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAKS_START),
  validate(startBreakSchema),
  breaksController.startBreak
);

/**
 * @swagger
 * /api/breaks/end:
 *   post:
 *     tags: [Breaks]
 *     summary: End the active break
 *     description: Ends the authenticated user's active break. Requires today's attendance, no check-out, an active break, and `breaks.end` permission. Calculates durationMinutes, allowedMinutes, and exceed.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreak'
 *       400:
 *         description: Attendance missing, checked out, or no active break exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  '/end',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAKS_END),
  breaksController.endBreak
);

/**
 * @swagger
 * /api/breaks/today:
 *   get:
 *     tags: [Breaks]
 *     summary: Get today's breaks
 *     description: Returns today's break logs for the authenticated user. Requires `breaks.read` permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's breaks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakToday'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/today',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAKS_READ),
  breaksController.getTodayBreaks
);

/**
 * @swagger
 * /api/breaks/history:
 *   get:
 *     tags: [Breaks]
 *     summary: Get break history
 *     description: Returns paginated break history for the authenticated user. Requires `breaks.history` permission.
 *     security:
 *       - bearerAuth: []
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
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from break start date, inclusive
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to break start date, inclusive
 *       - in: query
 *         name: breakTypeId
 *         schema:
 *           type: string
 *         description: Filter by break type MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Break history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakHistory'
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
  authorizePermissions(PERMISSIONS.BREAKS_HISTORY),
  validate(breakHistoryQuerySchema, 'query'),
  breaksController.getBreakHistory
);

/**
 * @swagger
 * /api/breaks/summary:
 *   get:
 *     tags: [Breaks]
 *     summary: Get break summary
 *     description: Returns aggregate break analytics for the authenticated user. Requires `breaks.summary` permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakSummary'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/summary',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAKS_SUMMARY),
  breaksController.getBreakSummary
);

/**
 * @swagger
 * /api/breaks/{id}:
 *   get:
 *     tags: [Breaks]
 *     summary: Get break by ID
 *     description: Returns a break by ID. Requires `breaks.read` permission. Users can access their own breaks; wildcard-permission users can access any break.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Break fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakLog'
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
  authorizePermissions(PERMISSIONS.BREAKS_READ),
  validate(getBreakByIdParamsSchema, 'params'),
  breaksController.getBreakById
);

module.exports = router;
