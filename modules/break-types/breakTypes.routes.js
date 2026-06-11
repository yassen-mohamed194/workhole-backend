const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const breakTypesController = require('./breakTypes.controller');
const {
  createBreakTypeSchema,
  updateBreakTypeSchema,
  getBreakTypeByIdParamsSchema,
} = require('./breakTypes.validation');

const router = Router();

/**
 * @swagger
 * /api/break-types:
 *   post:
 *     tags: [Break Types]
 *     summary: Create a new break type
 *     description: Creates a break type. Requires `break-types.create` permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBreakTypeRequest'
 *     responses:
 *       201:
 *         description: Break type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakType'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Break type already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAK_TYPES_CREATE),
  validate(createBreakTypeSchema),
  breakTypesController.createBreakType
);

/**
 * @swagger
 * /api/break-types:
 *   get:
 *     tags: [Break Types]
 *     summary: Get all active break types
 *     description: Returns all active break types. Requires `break-types.read` permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break types fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakTypes'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAK_TYPES_READ),
  breakTypesController.getBreakTypes
);

/**
 * @swagger
 * /api/break-types/{id}:
 *   get:
 *     tags: [Break Types]
 *     summary: Get break type by ID
 *     description: Returns one break type by ID. Requires `break-types.read` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break type MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Break type fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakType'
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
  authorizePermissions(PERMISSIONS.BREAK_TYPES_READ),
  validate(getBreakTypeByIdParamsSchema, 'params'),
  breakTypesController.getBreakTypeById
);

/**
 * @swagger
 * /api/break-types/{id}:
 *   patch:
 *     tags: [Break Types]
 *     summary: Update break type by ID
 *     description: Updates break type fields. Requires `break-types.update` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break type MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBreakTypeRequest'
 *     responses:
 *       200:
 *         description: Break type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithBreakType'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Duplicate break type name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAK_TYPES_UPDATE),
  validate(getBreakTypeByIdParamsSchema, 'params'),
  validate(updateBreakTypeSchema),
  breakTypesController.updateBreakTypeById
);

/**
 * @swagger
 * /api/break-types/{id}:
 *   delete:
 *     tags: [Break Types]
 *     summary: Soft delete break type by ID
 *     description: Soft deletes a break type (sets isActive to false). Requires `break-types.delete` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Break type MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Break type deleted successfully
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
 */
router.delete(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.BREAK_TYPES_DELETE),
  validate(getBreakTypeByIdParamsSchema, 'params'),
  breakTypesController.deleteBreakTypeById
);

module.exports = router;
