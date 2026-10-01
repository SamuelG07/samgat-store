import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas do carrinho exigem autenticação
router.use(authenticate);

router.get('/', cartController.getCart.bind(cartController));
router.post('/items', cartController.addItem.bind(cartController));
router.put('/items/:itemId', cartController.updateItem.bind(cartController));
router.delete('/items/:itemId', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
