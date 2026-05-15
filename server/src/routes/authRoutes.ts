import { Router } from 'express';
import { register, login, refreshAccessToken, logout, getProfile, getSessions, revokeSession } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validate, schemas } from '../middleware/validate';
import { verifyRecaptcha } from '../middleware/recaptcha';
import { auditMiddleware } from '../middleware/audit';

const router = Router();

router.post('/register', authLimiter, validate(schemas.register), verifyRecaptcha, auditMiddleware('REGISTER_ATTEMPT'), register);
router.post('/login', authLimiter, validate(schemas.login), verifyRecaptcha, auditMiddleware('LOGIN_ATTEMPT'), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.get('/sessions', authenticate, getSessions);
router.delete('/sessions/:sessionId', authenticate, revokeSession);

export default router;
