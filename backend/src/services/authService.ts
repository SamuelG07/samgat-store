import { userRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { TokenPayload, UserRole, RegisterRequest, LoginRequest } from '../types/auth';
import { AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export class AuthService {
  async register(data: RegisterRequest) {
    // Verificar se email já existe
    const userExists = await userRepository.exists(data.email);
    if (userExists) {
      throw new AppError({
        message: 'Email já cadastrado',
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário (sempre como CUSTOMER)
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'CUSTOMER',
    });

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginRequest) {
    // Buscar usuário pelo email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError({
        message: 'Credenciais inválidas',
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Verificar senha
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError({
        message: 'Credenciais inválidas',
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Gerar tokens
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    logger.info(`Usuário logado: ${user.email}`);

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: 'Usuário não encontrado',
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshToken(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: 'Usuário não encontrado',
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = generateAccessToken(payload);
    return { accessToken };
  }
}

export const authService = new AuthService();
