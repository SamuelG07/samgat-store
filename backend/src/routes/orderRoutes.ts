import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas de pedido exigem autenticação
router.use(authenticate);

router.post('/checkout', orderController.checkout.bind(orderController));
router.get('/', orderController.getOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));

export default router;
