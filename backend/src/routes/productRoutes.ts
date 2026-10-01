import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Rotas públicas
router.get('/', productController.findAll.bind(productController));
router.get('/slug/:slug', productController.findBySlug.bind(productController));
router.get('/:id', productController.findById.bind(productController));

// Rotas administrativas (apenas ADMIN)
router.post('/', authenticate, requireRole('ADMIN'), productController.create.bind(productController));
router.put('/:id', authenticate, requireRole('ADMIN'), productController.update.bind(productController));
router.delete('/:id', authenticate, requireRole('ADMIN'), productController.delete.bind(productController));

export default router;
