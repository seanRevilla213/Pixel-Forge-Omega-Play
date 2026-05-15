import { Router } from 'express';
import { getAllProducts, getFeaturedProducts, getProductBySlug, getProductById } from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;
