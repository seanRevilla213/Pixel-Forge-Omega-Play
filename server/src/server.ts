import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/security';
import { initDatabase } from './models/database';
import { generalLimiter } from './middleware/rateLimiter';
import { sanitizeInput } from './middleware/sanitize';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://www.google.com"],
      frameSrc: ["https://www.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS - strict origin whitelist
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookies
app.use(cookieParser());

// Global rate limiter
app.use(generalLimiter);

// Input sanitization
app.use(sanitizeInput);

// Prevent clickjacking
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder image generator
app.get('/api/placeholder/:id', (req, res) => {
  const { id } = req.params;
  const colors = ['0f0f1a', '1a0a2e', '0a1628', '1a0a1a', '0a1a0a', '1a1a0a', '0a0a1a', '1a0a0a'];
  const accents = ['00f0ff', 'ff00e5', 'b026ff', '39ff14', 'ff3131', 'ffd700', '00ff88', 'ff6b35'];
  const idx = Math.abs(id.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % colors.length;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#${colors[idx]}"/>
        <stop offset="100%" style="stop-color:#${colors[(idx + 1) % colors.length]}"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="600" height="400" fill="url(#bg)"/>
    <circle cx="300" cy="180" r="60" fill="none" stroke="#${accents[idx]}" stroke-width="2" opacity="0.5"/>
    <polygon points="280,160 280,200 320,180" fill="#${accents[idx]}" opacity="0.8" filter="url(#glow)"/>
    <text x="300" y="280" text-anchor="middle" fill="#${accents[idx]}" font-family="sans-serif" font-size="14" opacity="0.6">PIXEL FORGE</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(svg);
});

// Global error handler - don't leak stack traces
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
