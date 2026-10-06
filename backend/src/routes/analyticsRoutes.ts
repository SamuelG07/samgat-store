import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/sales', analyticsController.getSalesOverTime.bind(analyticsController));
router.get('/top-products', analyticsController.getTopProducts.bind(analyticsController));
router.get('/categories', analyticsController.getSalesByCategory.bind(analyticsController));
router.get('/customers/growth', analyticsController.getCustomerGrowth.bind(analyticsController));
router.get('/customers/stats', analyticsController.getCustomerStats.bind(analyticsController));

export default router;
