const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const companyMemberController = require('./companyMember.controller');
const {
  addCompanyMemberSchema,
  updateCompanyMemberSchema,
  companyMemberParamsSchema,
  companyIdParamsSchema,
} = require('./companyMember.validation');

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/companies/{companyId}/users:
 *   post:
 *     tags: [Company Members]
 *     summary: Add a user to a company
 *     description: |
 *       Creates a company membership with a per-company role.
 *
 *       **Required permission:** `companies.members.create`
 *
 *       Validates that the company, user, and role exist. Prevents duplicate membership for the same company and user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CompanyIdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCompanyMemberRequest'
 *           examples:
 *             addMember:
 *               summary: Add company member
 *               value:
 *                 userId: 681a3c7ac9ab39d812345678
 *                 roleId: 6820ab17c9ab39d812345679
 *     responses:
 *       201:
 *         description: Company member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompanyMember'
 *             examples:
 *               created:
 *                 summary: Member created
 *                 value:
 *                   status: success
 *                   data:
 *                     _id: 6820ab17c9ab39d812345685
 *                     companyId: 6820ab17c9ab39d812345684
 *                     userId:
 *                       _id: 681a3c7ac9ab39d812345678
 *                       firstName: John
 *                       lastName: Doe
 *                       email: john@example.com
 *                       phone: '01234567890'
 *                       status: active
 *                     roleId:
 *                       _id: 6820ab17c9ab39d812345679
 *                       name: employee
 *                       permissions: ['attendance.checkin', 'attendance.checkout']
 *                       isSystem: true
 *                     status: active
 *                     joinedAt: '2026-06-18T10:00:00.000Z'
 *                     createdAt: '2026-06-18T10:00:00.000Z'
 *                     updatedAt: '2026-06-18T10:00:00.000Z'
 *       400:
 *         description: Validation error (invalid ObjectId or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidUserId:
 *                 value:
 *                   status: error
 *                   message: Invalid userId
 *               invalidRoleId:
 *                 value:
 *                   status: error
 *                   message: Invalid roleId
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — missing `companies.members.create` permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   status: error
 *                   message: Forbidden
 *       404:
 *         description: Company, user, or role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               companyNotFound:
 *                 value:
 *                   status: error
 *                   message: Company not found
 *               userNotFound:
 *                 value:
 *                   status: error
 *                   message: User not found
 *               roleNotFound:
 *                 value:
 *                   status: error
 *                   message: Role not found
 *       409:
 *         $ref: '#/components/responses/MembershipAlreadyExists'
 */
router.post(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_MEMBERS_CREATE),
  validate(companyIdParamsSchema, 'params'),
  validate(addCompanyMemberSchema),
  companyMemberController.addCompanyMember
);

/**
 * @swagger
 * /api/companies/{companyId}/users:
 *   get:
 *     tags: [Company Members]
 *     summary: Get all company members
 *     description: |
 *       Returns all members of a company with populated user and role data.
 *
 *       **Required permission:** `companies.members.read`
 *
 *       Password and refreshToken are never included in populated user data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CompanyIdPathParam'
 *     responses:
 *       200:
 *         description: Company members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompanyMembers'
 *             examples:
 *               members:
 *                 summary: Company members list
 *                 value:
 *                   status: success
 *                   data:
 *                     - _id: 6820ab17c9ab39d812345685
 *                       companyId: 6820ab17c9ab39d812345684
 *                       userId:
 *                         _id: 681a3c7ac9ab39d812345678
 *                         firstName: John
 *                         lastName: Doe
 *                         email: john@example.com
 *                         phone: '01234567890'
 *                         status: active
 *                       roleId:
 *                         _id: 6820ab17c9ab39d812345679
 *                         name: employee
 *                         permissions: ['attendance.checkin']
 *                         isSystem: true
 *                       status: active
 *                       joinedAt: '2026-06-18T10:00:00.000Z'
 *                       createdAt: '2026-06-18T10:00:00.000Z'
 *                       updatedAt: '2026-06-18T10:00:00.000Z'
 *       400:
 *         description: Validation error (invalid companyId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidCompanyId:
 *                 value:
 *                   status: error
 *                   message: Invalid companyId
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — missing `companies.members.read` permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   status: error
 *                   message: Forbidden
 *       404:
 *         $ref: '#/components/responses/CompanyNotFound'
 */
router.get(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_MEMBERS_READ),
  validate(companyIdParamsSchema, 'params'),
  companyMemberController.getCompanyMembers
);

/**
 * @swagger
 * /api/companies/{companyId}/users/{userId}:
 *   get:
 *     tags: [Company Members]
 *     summary: Get company member by user ID
 *     description: |
 *       Returns one company membership for the given company and user.
 *
 *       **Required permission:** `companies.members.read`
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CompanyIdPathParam'
 *       - $ref: '#/components/parameters/UserIdPathParam'
 *     responses:
 *       200:
 *         description: Company member fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompanyMember'
 *             examples:
 *               member:
 *                 summary: Single company member
 *                 value:
 *                   status: success
 *                   data:
 *                     _id: 6820ab17c9ab39d812345685
 *                     companyId: 6820ab17c9ab39d812345684
 *                     userId:
 *                       _id: 681a3c7ac9ab39d812345678
 *                       firstName: John
 *                       lastName: Doe
 *                       email: john@example.com
 *                       phone: '01234567890'
 *                       status: active
 *                     roleId:
 *                       _id: 6820ab17c9ab39d812345679
 *                       name: employee
 *                       permissions: ['attendance.checkin']
 *                       isSystem: true
 *                     status: active
 *                     joinedAt: '2026-06-18T10:00:00.000Z'
 *                     createdAt: '2026-06-18T10:00:00.000Z'
 *                     updatedAt: '2026-06-18T10:00:00.000Z'
 *       400:
 *         description: Validation error (invalid companyId or userId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidCompanyId:
 *                 value:
 *                   status: error
 *                   message: Invalid companyId
 *               invalidUserId:
 *                 value:
 *                   status: error
 *                   message: Invalid userId
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — missing `companies.members.read` permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   status: error
 *                   message: Forbidden
 *       404:
 *         description: Company or membership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               companyNotFound:
 *                 value:
 *                   status: error
 *                   message: Company not found
 *               membershipNotFound:
 *                 value:
 *                   status: error
 *                   message: Membership not found
 */
router.get(
  '/:userId',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_MEMBERS_READ),
  validate(companyMemberParamsSchema, 'params'),
  companyMemberController.getCompanyMember
);

/**
 * @swagger
 * /api/companies/{companyId}/users/{userId}:
 *   patch:
 *     tags: [Company Members]
 *     summary: Update company member
 *     description: |
 *       Partially updates a company member role and/or status.
 *
 *       **Required permission:** `companies.members.update`
 *
 *       At least one of `roleId` or `status` must be provided. Status must be one of: `active`, `inactive`, `pending`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CompanyIdPathParam'
 *       - $ref: '#/components/parameters/UserIdPathParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCompanyMemberRequest'
 *           examples:
 *             updateRole:
 *               summary: Update member role
 *               value:
 *                 roleId: 6820ab17c9ab39d812345679
 *             updateStatus:
 *               summary: Update member status
 *               value:
 *                 status: active
 *             updateBoth:
 *               summary: Update role and status
 *               value:
 *                 roleId: 6820ab17c9ab39d812345679
 *                 status: inactive
 *     responses:
 *       200:
 *         description: Company member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompanyMember'
 *             examples:
 *               updated:
 *                 summary: Member updated
 *                 value:
 *                   status: success
 *                   data:
 *                     _id: 6820ab17c9ab39d812345685
 *                     companyId: 6820ab17c9ab39d812345684
 *                     userId:
 *                       _id: 681a3c7ac9ab39d812345678
 *                       firstName: John
 *                       lastName: Doe
 *                       email: john@example.com
 *                       status: active
 *                     roleId:
 *                       _id: 6820ab17c9ab39d812345679
 *                       name: employee
 *                       permissions: ['attendance.checkin']
 *                       isSystem: true
 *                     status: inactive
 *                     joinedAt: '2026-06-18T10:00:00.000Z'
 *                     createdAt: '2026-06-18T10:00:00.000Z'
 *                     updatedAt: '2026-06-18T11:00:00.000Z'
 *       400:
 *         description: Validation error (invalid fields or empty body)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               atLeastOneField:
 *                 value:
 *                   status: error
 *                   message: At least one field is required
 *               invalidStatus:
 *                 value:
 *                   status: error
 *                   message: Invalid enum value. Expected 'active' | 'inactive' | 'pending'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — missing `companies.members.update` permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   status: error
 *                   message: Forbidden
 *       404:
 *         description: Company, membership, or role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               companyNotFound:
 *                 value:
 *                   status: error
 *                   message: Company not found
 *               membershipNotFound:
 *                 value:
 *                   status: error
 *                   message: Membership not found
 *               roleNotFound:
 *                 value:
 *                   status: error
 *                   message: Role not found
 */
router.patch(
  '/:userId',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_MEMBERS_UPDATE),
  validate(companyMemberParamsSchema, 'params'),
  validate(updateCompanyMemberSchema),
  companyMemberController.updateCompanyMember
);

/**
 * @swagger
 * /api/companies/{companyId}/users/{userId}:
 *   delete:
 *     tags: [Company Members]
 *     summary: Remove company member
 *     description: |
 *       Removes a user from a company. Does not delete the user or company records.
 *
 *       **Required permission:** `companies.members.delete`
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CompanyIdPathParam'
 *       - $ref: '#/components/parameters/UserIdPathParam'
 *     responses:
 *       200:
 *         description: Membership removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *             examples:
 *               removed:
 *                 value:
 *                   status: success
 *                   message: Membership removed successfully
 *       400:
 *         description: Validation error (invalid companyId or userId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidCompanyId:
 *                 value:
 *                   status: error
 *                   message: Invalid companyId
 *               invalidUserId:
 *                 value:
 *                   status: error
 *                   message: Invalid userId
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — missing `companies.members.delete` permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   status: error
 *                   message: Forbidden
 *       404:
 *         description: Company or membership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               companyNotFound:
 *                 value:
 *                   status: error
 *                   message: Company not found
 *               membershipNotFound:
 *                 value:
 *                   status: error
 *                   message: Membership not found
 */
router.delete(
  '/:userId',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_MEMBERS_DELETE),
  validate(companyMemberParamsSchema, 'params'),
  companyMemberController.deleteCompanyMember
);

module.exports = router;
