import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { handleErrorResponse, AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(
    `Erro na requisição: ${req.method} ${req.originalUrl}`,
    {
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
    }
  );

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  handleErrorResponse(res, err);
};
