import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({ error: 'Validation failed', details: errors });
        return;
      }
      res.status(500).json({ error: 'Internal validation error' });
    }
  };
};

// Common validation schemas
export const schemas = {
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email format').max(255),
      username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      password: z.string().min(8, 'Password must be at least 8 characters').max(128)
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
    }),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough(),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format').max(255),
      password: z.string().min(1, 'Password is required').max(128),
      recaptchaToken: z.string().optional(),
    }),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough(),
  }),

  contactMessage: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email().max(255),
      subject: z.string().min(5).max(200),
      message: z.string().min(10).max(5000),
      recaptchaToken: z.string().optional(),
    }),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough(),
  }),

  productId: z.object({
    body: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    params: z.object({
      id: z.string().uuid('Invalid product ID'),
    }),
  }),

  checkout: z.object({
    body: z.object({
      items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(99),
      })).min(1).max(50),
      shippingAddress: z.string().min(10).max(500),
      paymentMethod: z.string().min(2).max(50),
    }),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough(),
  }),
};
