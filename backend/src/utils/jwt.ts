import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload } from '../types/auth';

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    config.jwt.accessSecret, 
    { expiresIn: config.jwt.accessExpiresIn as SignOptions['expiresIn'] }
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    config.jwt.refreshSecret, 
    { expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'] }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Refresh token inválido ou expirado');
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};
