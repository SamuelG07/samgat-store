import dotenv from 'dotenv';

dotenv.config();

// Parse CORS_ORIGIN como array (separado por vírgula)
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  cors: {
    origins: corsOrigins,
    origin: corsOrigins[0], // compatibilidade
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    auth: {
      windowMs: 5 * 60 * 1000,
      max: 10,
    },
  },

  security: {
    bcryptRounds: 12,
  },

  cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
},

export type Config = typeof config;
