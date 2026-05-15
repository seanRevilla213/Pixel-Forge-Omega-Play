import { Request, Response, NextFunction } from 'express';

// Strip dangerous characters from strings
const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets (basic XSS)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .replace(/data:\s*text\/html/gi, '') // Remove data URIs
    .trim();
};

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[sanitizeString(key)] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};
