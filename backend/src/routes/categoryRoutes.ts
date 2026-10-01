import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Rotas públicas
router.get('/', categoryController.findAll.bind(categoryController));
router.get('/:id', categoryController.findById.bind(categoryController));

// Rotas administrativas (apenas ADMIN)
router.post('/', authenticate, requireRole('ADMIN'), categoryController.create.bind(categoryController));
router.put('/:id', authenticate, requireRole('ADMIN'), categoryController.update.bind(categoryController));
router.delete('/:id', authenticate, requireRole('ADMIN'), categoryController.delete.bind(categoryController));

export default router;
