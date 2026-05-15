import jwt from 'jsonwebtoken';
import { config } from '../config/security';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
    issuer: 'pixel-forge-omega',
    audience: 'pixel-forge-client',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
    issuer: 'pixel-forge-omega',
    audience: 'pixel-forge-client',
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret, {
    issuer: 'pixel-forge-omega',
    audience: 'pixel-forge-client',
  }) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret, {
    issuer: 'pixel-forge-omega',
    audience: 'pixel-forge-client',
  }) as TokenPayload;
};
