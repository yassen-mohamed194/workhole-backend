const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const rolesController = require('./roles.controller');
const {
  createRoleSchema,
  updateRoleSchema,
  getRoleByIdParamsSchema,
} = require('./roles.validation');

const router = Router();

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Creates a custom role with assignable permissions. Requires `roles.manage` permission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithRole'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Role already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ROLES_MANAGE),
  validate(createRoleSchema),
  rolesController.createRole
);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     description: Returns all roles. Requires `roles.manage` permission.
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithRoles'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/', authMiddleware, authorizePermissions(PERMISSIONS.ROLES_MANAGE), rolesController.getRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     description: Returns one role by ID. Requires `roles.manage` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithRole'
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
  authorizePermissions(PERMISSIONS.ROLES_MANAGE),
  validate(getRoleByIdParamsSchema, 'params'),
  rolesController.getRoleById
);

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     tags: [Roles]
 *     summary: Update role by ID
 *     description: Updates role name and/or permissions. System admin role name and permissions cannot be modified. Requires `roles.manage` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithRole'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Protected system role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Duplicate role name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ROLES_MANAGE),
  validate(getRoleByIdParamsSchema, 'params'),
  validate(updateRoleSchema),
  rolesController.updateRoleById
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role by ID
 *     description: Deletes a non-system role that is not assigned to any user. Requires `roles.manage` permission.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Cannot delete system role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Role is assigned to users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.ROLES_MANAGE),
  validate(getRoleByIdParamsSchema, 'params'),
  rolesController.deleteRoleById
);

module.exports = router;
