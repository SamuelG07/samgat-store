import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(
    new AppError({
      message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
    })
  );
};
