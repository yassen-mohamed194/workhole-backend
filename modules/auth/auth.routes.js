const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const validate = require('../../shared/middleware/validate');
const authController = require('./auth.controller');
const { loginSchema, changePasswordSchema } = require('./auth.validation');

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.patch('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
