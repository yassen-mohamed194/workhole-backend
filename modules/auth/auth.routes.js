const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const validate = require('../../shared/middleware/validate');
const authController = require('./auth.controller');
const { loginSchema, changePasswordSchema, refreshTokenSchema, logoutSchema } = require('./auth.validation');

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email/identifier and password
 *     description: Authenticates a user and returns access and refresh tokens.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             default:
 *               value:
 *                 identifier: admin@gmail.com
 *                 password: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponseData'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/login', validate(loginSchema), authController.login);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Issue a new access token
 *     description: Validates a refresh token and returns a fresh access token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *           examples:
 *             default:
 *               value:
 *                 refreshToken: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/RefreshTokenResponseData'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout a user session
 *     description: Invalidates the provided refresh token and logs out the user.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *           examples:
 *             default:
 *               value:
 *                 refreshToken: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessMessageResponse'
 *             examples:
 *               default:
 *                 value:
 *                   status: success
 *                   message: Logged out successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/logout', validate(logoutSchema), authController.logout);
/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Change current user password
 *     description: Requires a valid bearer access token and the current password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *           examples:
 *             default:
 *               value:
 *                 oldPassword: old123
 *                 newPassword: new123456
 *     responses:
 *       200:
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessMessageResponse'
 *             examples:
 *               default:
 *                 value:
 *                   status: success
 *                   message: Password updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
