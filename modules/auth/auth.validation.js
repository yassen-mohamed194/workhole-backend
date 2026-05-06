const { z } = require('zod');

const loginSchema = z.object({
  identifier: z.string().min(1, 'identifier is required'),
  password: z.string().min(1, 'password is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'oldPassword is required'),
  newPassword: z.string().min(6, 'newPassword must be at least 6 characters'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
  logoutSchema,
};
