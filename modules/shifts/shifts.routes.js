const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const shiftsController = require('./shifts.controller');
const {
  createShiftSchema,
  updateShiftSchema,
  updateShiftStatusSchema,
  getShiftByIdParamsSchema,
} = require('./shifts.validation');

const router = Router();

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     tags: [Shifts]
 *     summary: Create a new shift
 *     description: Creates a shift schedule. Requires `shifts.create` permission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShiftRequest'
 *     responses:
 *       201:
 *         description: Shift created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithShift'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Shift already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.SHIFTS_CREATE),
  validate(createShiftSchema),
  shiftsController.createShift
);

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     tags: [Shifts]
 *     summary: Get all shifts
 *     description: Returns all shifts. Requires `shifts.read` permission.
 *     responses:
 *       200:
 *         description: Shifts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithShifts'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.SHIFTS_READ),
  shiftsController.getShifts
);

/**
 * @swagger
 * /api/shifts/{id}:
 *   get:
 *     tags: [Shifts]
 *     summary: Get shift by ID
 *     description: Returns one shift by ID. Requires `shifts.read` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Shift fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithShift'
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
  authorizePermissions(PERMISSIONS.SHIFTS_READ),
  validate(getShiftByIdParamsSchema, 'params'),
  shiftsController.getShiftById
);

/**
 * @swagger
 * /api/shifts/{id}:
 *   patch:
 *     tags: [Shifts]
 *     summary: Update shift by ID
 *     description: Updates shift fields. Requires `shifts.update` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShiftRequest'
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithShift'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Duplicate shift name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.SHIFTS_UPDATE),
  validate(getShiftByIdParamsSchema, 'params'),
  validate(updateShiftSchema),
  shiftsController.updateShiftById
);

/**
 * @swagger
 * /api/shifts/{id}/status:
 *   patch:
 *     tags: [Shifts]
 *     summary: Update shift status by ID
 *     description: Activates or deactivates a shift. Requires `shifts.update` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShiftStatusRequest'
 *     responses:
 *       200:
 *         description: Shift status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithShift'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/:id/status',
  authMiddleware,
  authorizePermissions(PERMISSIONS.SHIFTS_UPDATE),
  validate(getShiftByIdParamsSchema, 'params'),
  validate(updateShiftStatusSchema),
  shiftsController.updateShiftStatusById
);

/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     tags: [Shifts]
 *     summary: Delete shift by ID
 *     description: Deletes a shift that is not assigned to any user. Requires `shifts.delete` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Shift deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Shift is assigned to users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.SHIFTS_DELETE),
  validate(getShiftByIdParamsSchema, 'params'),
  shiftsController.deleteShiftById
);

module.exports = router;
