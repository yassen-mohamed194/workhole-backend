const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const authorizePermissions = require('../../shared/middleware/authorizePermissions');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const validate = require('../../shared/middleware/validate');
const companyController = require('./company.controller');
const companyMemberRoutes = require('./companyMember.routes');
const {
  createCompanySchema,
  updateCompanySchema,
  getCompanyByIdParamsSchema,
} = require('./company.validation');

const router = Router();

router.use('/:companyId/users', companyMemberRoutes);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a new company
 *     description: Creates a company. Requires `companies.create` permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyRequest'
 *           examples:
 *             createCompany:
 *               summary: Create company
 *               value:
 *                 name: Acme Corporation
 *                 code: acme-corp
 *                 email: contact@acme.com
 *                 phone: '01234567890'
 *                 address: 123 Business Street, Cairo
 *                 logo: https://cdn.example.com/acme-logo.png
 *                 status: active
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompany'
 *             examples:
 *               created:
 *                 summary: Company created
 *                 value:
 *                   status: success
 *                   data:
 *                     _id: 6820ab17c9ab39d812345684
 *                     name: Acme Corporation
 *                     code: acme-corp
 *                     email: contact@acme.com
 *                     phone: '01234567890'
 *                     address: 123 Business Street, Cairo
 *                     logo: https://cdn.example.com/acme-logo.png
 *                     status: active
 *                     createdAt: '2026-06-18T10:00:00.000Z'
 *                     updatedAt: '2026-06-18T10:00:00.000Z'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Duplicate company code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               duplicateCode:
 *                 value:
 *                   status: error
 *                   message: Duplicate company code
 */
router.post(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_CREATE),
  validate(createCompanySchema),
  companyController.createCompany
);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: Get all companies
 *     description: Returns all companies sorted by newest first. Requires `companies.read` permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompanies'
 *             examples:
 *               companies:
 *                 summary: Company list
 *                 value:
 *                   status: success
 *                   data:
 *                     - _id: 6820ab17c9ab39d812345684
 *                       name: Acme Corporation
 *                       code: acme-corp
 *                       email: contact@acme.com
 *                       phone: '01234567890'
 *                       address: 123 Business Street, Cairo
 *                       logo: https://cdn.example.com/acme-logo.png
 *                       status: active
 *                       createdAt: '2026-06-18T10:00:00.000Z'
 *                       updatedAt: '2026-06-18T10:00:00.000Z'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_READ),
  companyController.getCompanies
);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get company by ID
 *     description: Returns one company by ID. Requires `companies.read` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Company fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompany'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               notFound:
 *                 value:
 *                   status: error
 *                   message: Company not found
 */
router.get(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_READ),
  validate(getCompanyByIdParamsSchema, 'params'),
  companyController.getCompanyById
);

/**
 * @swagger
 * /api/companies/{id}:
 *   patch:
 *     tags: [Companies]
 *     summary: Update company by ID
 *     description: Partially updates a company. Requires `companies.update` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCompanyRequest'
 *           examples:
 *             updateCompany:
 *               summary: Update company
 *               value:
 *                 name: Acme Corp International
 *                 status: inactive
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponseWithCompany'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Duplicate company code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               duplicateCode:
 *                 value:
 *                   status: error
 *                   message: Duplicate company code
 */
router.patch(
  '/:id',
  authMiddleware,
  authorizePermissions(PERMISSIONS.COMPANIES_UPDATE),
  validate(getCompanyByIdParamsSchema, 'params'),
  validate(updateCompanySchema),
  companyController.updateCompanyById
);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     tags: [Companies]
 *     summary: Delete company by ID
 *     description: Permanently deletes a company. Requires `companies.delete` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *             examples:
 *               deleted:
 *                 value:
 *                   status: success
 *                   message: Company deleted successfully
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
  authorizePermissions(PERMISSIONS.COMPANIES_DELETE),
  validate(getCompanyByIdParamsSchema, 'params'),
  companyController.deleteCompanyById
);

module.exports = router;
