import { Router } from 'express';
import { createOrder, getUserOrders, submitContactMessage } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validate';
import { checkoutLimiter, contactLimiter } from '../middleware/rateLimiter';
import { verifyRecaptcha } from '../middleware/recaptcha';

const router = Router();

router.post('/checkout', authenticate, checkoutLimiter, validate(schemas.checkout), createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.post('/contact', contactLimiter, validate(schemas.contactMessage), verifyRecaptcha, submitContactMessage);

export default router;
