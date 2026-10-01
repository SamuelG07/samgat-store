import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

const connectSrc = ["'self'", ...config.cors.origins];

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: connectSrc,
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
});

export const securityLogger = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.headers['user-agent']?.includes('bot') || req.headers['user-agent']?.includes('crawler')) {
    console.log(`[Security] Bot detectado: ${req.ip} - ${req.headers['user-agent']}`);
  }
  next();
};
