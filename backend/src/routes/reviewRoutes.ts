import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Público — ver reviews de um produto
router.get('/product/:productId', reviewController.getByProduct.bind(reviewController));

// Autenticado — criar review
router.post('/', authenticate, reviewController.create.bind(reviewController));

// Apenas ADMIN — apagar review
router.delete('/:id', authenticate, requireRole('ADMIN'), reviewController.delete.bind(reviewController));

export default router;
