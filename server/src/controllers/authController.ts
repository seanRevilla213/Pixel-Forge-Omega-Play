import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDatabase } from '../models/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { hashToken } from '../utils/crypto';
import { config } from '../config/security';
import { logger, auditLog } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const db = getDb();

    // Check if user exists
    const existing = db.exec("SELECT id FROM users WHERE email = ? OR username = ?", [email, username] as any);
    if (existing.length > 0 && existing[0].values.length > 0) {
      res.status(409).json({ error: 'Email or username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
    const userId = uuidv4();

    db.run(
      `INSERT INTO users (id, email, username, password_hash, role) VALUES (?, ?, ?, ?, 'user')`,
      [userId, email, username, hashedPassword]
    );
    saveDatabase();

    // Generate tokens
    const tokenPayload: TokenPayload = { userId, email, role: 'user' };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token hash
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.run(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), userId, tokenHash, req.headers['user-agent'] || '', req.ip || '', expiresAt]
    );
    saveDatabase();

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    auditLog('USER_REGISTER', userId, { email, ip: req.ip });

    res.status(201).json({
      accessToken,
      user: { id: userId, email, username, role: 'user' },
    });
  } catch (error: any) {
    logger.error('Registration error', { error: error.message });
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = getDb();

    // Find user with prepared statement
    const result = db.exec("SELECT * FROM users WHERE email = ?", [email] as any);

    if (result.length === 0 || result[0].values.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const columns = result[0].columns;
    const row = result[0].values[0];
    const user: Record<string, any> = {};
    columns.forEach((col, i) => { user[col] = row[i]; });

    // Check if account is locked
    if (user.is_locked && user.locked_until) {
      const lockedUntil = new Date(user.locked_until);
      if (lockedUntil > new Date()) {
        auditLog('LOGIN_LOCKED', user.id, { email, ip: req.ip });
        res.status(423).json({
          error: 'Account temporarily locked due to too many failed attempts',
          lockedUntil: user.locked_until,
        });
        return;
      }
      // Unlock if lockout expired
      db.run("UPDATE users SET is_locked = 0, login_attempts = 0, locked_until = NULL WHERE id = ?", [user.id]);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      const attempts = (user.login_attempts || 0) + 1;

      if (attempts >= config.security.maxLoginAttempts) {
        const lockedUntil = new Date(Date.now() + config.security.lockoutDuration).toISOString();
        db.run(
          "UPDATE users SET login_attempts = ?, is_locked = 1, locked_until = ? WHERE id = ?",
          [attempts, lockedUntil, user.id]
        );
        saveDatabase();
        auditLog('ACCOUNT_LOCKED', user.id, { email, attempts, ip: req.ip });
        res.status(423).json({ error: 'Account locked due to too many failed attempts' });
        return;
      }

      db.run("UPDATE users SET login_attempts = ? WHERE id = ?", [attempts, user.id]);
      saveDatabase();
      auditLog('LOGIN_FAILED', user.id, { email, attempts, ip: req.ip });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Reset login attempts on success
    db.run("UPDATE users SET login_attempts = 0, is_locked = 0, locked_until = NULL WHERE id = ?", [user.id]);

    // Generate tokens
    const tokenPayload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token hash
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.run(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), user.id, tokenHash, req.headers['user-agent'] || '', req.ip || '', expiresAt]
    );
    saveDatabase();

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    auditLog('LOGIN_SUCCESS', user.id, { email, ip: req.ip });

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
    });
  } catch (error: any) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    // Verify the old token
    const payload = verifyRefreshToken(oldRefreshToken);
    const db = getDb();

    // Check if token exists in DB (not revoked)
    const oldTokenHash = hashToken(oldRefreshToken);
    const tokenResult = db.exec(
      "SELECT * FROM refresh_tokens WHERE token_hash = ? AND user_id = ?",
      [oldTokenHash, payload.userId] as any
    );

    if (tokenResult.length === 0 || tokenResult[0].values.length === 0) {
      // Token reuse detected — revoke all tokens for this user
      db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [payload.userId]);
      saveDatabase();
      auditLog('TOKEN_REUSE_DETECTED', payload.userId, { ip: req.ip });
      res.clearCookie('refreshToken', { path: '/api/auth' });
      res.status(401).json({ error: 'Token reuse detected. All sessions revoked.' });
      return;
    }

    // Delete old token (rotation)
    db.run("DELETE FROM refresh_tokens WHERE token_hash = ?", [oldTokenHash]);

    // Generate new tokens
    const tokenPayload: TokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Store new refresh token
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.run(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, ip_address, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), payload.userId, newTokenHash, req.headers['user-agent'] || '', req.ip || '', expiresAt]
    );
    saveDatabase();

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    logger.error('Token refresh error', { error: error.message });
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const db = getDb();
      const tokenHash = hashToken(refreshToken);
      db.run("DELETE FROM refresh_tokens WHERE token_hash = ?", [tokenHash]);
      saveDatabase();
    }

    res.clearCookie('refreshToken', { path: '/api/auth' });
    auditLog('LOGOUT', req.user?.userId || null, { ip: req.ip });
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    logger.error('Logout error', { error: error.message });
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const result = db.exec(
      "SELECT id, email, username, role, created_at FROM users WHERE id = ?",
      [req.user!.userId] as any
    );

    if (result.length === 0 || result[0].values.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const columns = result[0].columns;
    const row = result[0].values[0];
    const user: Record<string, any> = {};
    columns.forEach((col, i) => { user[col] = row[i]; });

    // Get active sessions
    const sessions = db.exec(
      "SELECT id, device_info, ip_address, created_at FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC",
      [req.user!.userId] as any
    );

    const activeSessions = sessions.length > 0
      ? sessions[0].values.map((row) => {
          const session: Record<string, any> = {};
          sessions[0].columns.forEach((col, i) => { session[col] = row[i]; });
          return session;
        })
      : [];

    res.json({ user, activeSessions });
  } catch (error: any) {
    logger.error('Get profile error', { error: error.message });
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const sessions = db.exec(
      "SELECT id, device_info, ip_address, created_at, expires_at FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC",
      [req.user!.userId] as any
    );

    const data = sessions.length > 0
      ? sessions[0].values.map((row) => {
          const session: Record<string, any> = {};
          sessions[0].columns.forEach((col, i) => { session[col] = row[i]; });
          return session;
        })
      : [];

    res.json({ sessions: data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
};

export const revokeSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const db = getDb();

    db.run(
      "DELETE FROM refresh_tokens WHERE id = ? AND user_id = ?",
      [sessionId, req.user!.userId]
    );
    saveDatabase();

    auditLog('SESSION_REVOKED', req.user!.userId, { sessionId, ip: req.ip });
    res.json({ message: 'Session revoked' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to revoke session' });
  }
};
