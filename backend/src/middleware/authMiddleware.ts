import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { getTokensFromCookies } from '../utils/cookie';
import { AppError } from '../utils/errorHandler';
import { TokenPayload } from '../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obter token dos cookies ou do header Authorization
    let token: string | undefined;

    const { accessToken } = getTokensFromCookies(req);
    if (accessToken) {
      token = accessToken;
    } else {
      // Fallback para header Authorization (Bearer token)
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      next(new AppError({
        message: 'Token não fornecido',
        statusCode: 401,
        code: 'TOKEN_MISSING',
      }));
      return;
    }

    try {
      // Verificar token
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (jwtError) {
      next(new AppError({
        message: 'Token inválido ou expirado',
        statusCode: 401,
        code: 'INVALID_TOKEN',
      }));
    }
  } catch (error) {
    next(new AppError({
      message: 'Erro na autenticação',
      statusCode: 401,
      code: 'AUTH_ERROR',
    }));
  }
};
