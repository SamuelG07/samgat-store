import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { registerSchema, loginSchema } from '../validations/authSchemas';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie';
import { AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);

      logger.info(`Novo usuário registrado: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso!',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await authService.login(validatedData);

      setAuthCookies(res, accessToken, refreshToken);

      logger.info(`Usuário logado: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAuthCookies(res);
      logger.info(`Usuário deslogado: ${req.user?.email || 'unknown'}`);
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError({
          message: 'Usuário não autenticado',
          statusCode: 401,
          code: 'UNAUTHENTICATED',
        });
      }

      const { accessToken } = await authService.refreshToken(req.user.userId);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Token renovado com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
