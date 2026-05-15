import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { getStats, getAllUsers, getAllOrders, updateOrderStatus, createProduct, deleteProduct, getAuditLogs, getMessages } from '../controllers/adminController';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);
router.get('/audit-logs', getAuditLogs);
router.get('/messages', getMessages);

export default router;
