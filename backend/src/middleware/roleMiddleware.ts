import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { UserRole } from '../types/auth';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError({
        message: 'Usuário não autenticado',
        statusCode: 401,
        code: 'UNAUTHENTICATED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError({
        message: 'Acesso negado. Permissão insuficiente.',
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
};
