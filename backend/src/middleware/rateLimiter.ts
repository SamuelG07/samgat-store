import rateLimit from 'express-rate-limit';
import { config } from '../config';

// Rate limiter geral
export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Muitas requisições. Por favor, aguarde um momento e tente novamente.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return process.env.NODE_ENV === 'development';
  },
});

// Rate limiter específico para autenticação
export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Por favor, aguarde alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return process.env.NODE_ENV === 'development';
  },
});

// Rate limiter mais rigoroso para endpoints sensíveis
export const strictRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // 5 requisições
  message: {
    success: false,
    message: 'Muitas tentativas. Por favor, aguarde alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req) => {
    return process.env.NODE_ENV === 'development';
  },
});
