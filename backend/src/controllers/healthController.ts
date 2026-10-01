import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { config } from '../config';
import { AppError } from '../utils/errorHandler';

export const healthCheck = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar conexão com o banco
    await prisma.$queryRaw`SELECT 1 as connected`;

    res.status(200).json({
      success: true,
      status: 'healthy',
      message: 'Samgat Store API está funcionando!',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  } catch (error) {
    next(
      new AppError({
        message: 'Falha na conexão com o banco de dados',
        statusCode: 503,
        code: 'DATABASE_CONNECTION_FAILED',
        isOperational: true,
      })
    );
  }
};

export const simpleHealth = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Samgat Store API está funcionando!',
    timestamp: new Date().toISOString(),
  });
};
