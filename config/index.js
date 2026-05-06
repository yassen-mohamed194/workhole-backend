const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const firstError = parsedEnv.error.issues[0];
  throw new Error(firstError?.message || 'Invalid environment configuration');
}

const env = parsedEnv.data;

module.exports = {
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
};
