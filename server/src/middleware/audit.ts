import { Request, Response, NextFunction } from 'express';
import { getDb, saveDatabase } from '../models/database';
import { v4 as uuidv4 } from 'uuid';

export const auditMiddleware = (action: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const db = getDb();
      db.run(
        `INSERT INTO audit_logs (id, user_id, action, resource, details, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          uuidv4(),
          req.user?.userId || null,
          action,
          req.originalUrl,
          JSON.stringify({ method: req.method, body: req.body ? '***' : null }),
          req.ip || 'unknown',
          req.headers['user-agent'] || 'unknown',
        ]
      );
      saveDatabase();
    } catch (error) {
      // Don't block requests if audit logging fails
    }
    next();
  };
};
