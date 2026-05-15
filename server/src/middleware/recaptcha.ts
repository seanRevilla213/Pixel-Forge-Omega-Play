import { Request, Response, NextFunction } from 'express';
import { config } from '../config/security';
import { logger } from '../utils/logger';

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Skip in development if no key configured
  if (config.nodeEnv === 'development' && !config.recaptcha.secretKey) {
    next();
    return;
  }

  const token = req.body.recaptchaToken;

  if (!token) {
    // In development, allow without token
    if (config.nodeEnv === 'development') {
      next();
      return;
    }
    res.status(400).json({ error: 'reCAPTCHA verification required' });
    return;
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${token}`,
      { method: 'POST' }
    );

    const data = await response.json();

    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      logger.warn('reCAPTCHA verification failed', {
        score: data.score,
        ip: req.ip,
        action: data.action,
      });
      res.status(403).json({ error: 'Bot detection triggered. Please try again.' });
      return;
    }

    next();
  } catch (error) {
    logger.error('reCAPTCHA verification error', { error });
    // In development, allow through on error
    if (config.nodeEnv === 'development') {
      next();
      return;
    }
    res.status(500).json({ error: 'Security verification failed' });
  }
};
