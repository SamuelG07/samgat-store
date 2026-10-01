import { Response } from 'express';
import { logger } from './logger';

export interface AppErrorOptions {
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode || 500;
    this.code = options.code;
    this.details = options.details;
    this.isOperational = options.isOperational !== undefined ? options.isOperational : true;

    // Manter stack trace para erros operacionais
    if (this.isOperational) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const handleErrorResponse = (res: Response, error: unknown): void => {
  if (error instanceof AppError) {
    // Erro operacional conhecido
    const response: any = {
      success: false,
      message: error.message,
    };

    // Adicionar detalhes em desenvolvimento
    if (process.env.NODE_ENV === 'development' && error.details) {
      response.details = error.details;
    }

    if (error.code) {
      response.code = error.code;
    }

    res.status(error.statusCode).json(response);
    return;
  }

  // Erro desconhecido (não operacional)
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error('Erro não tratado:', error);

  res.status(500).json({
    success: false,
    message: isProduction ? 'Erro interno do servidor' : 'Erro interno do servidor',
    ...(isProduction ? {} : { details: error instanceof Error ? error.message : 'Erro desconhecido' }),
  });
};
