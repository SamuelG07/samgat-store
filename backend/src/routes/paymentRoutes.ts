import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { uploadProof } from '../middleware/upload';

const router = Router();

// Admin
router.get('/pending', authenticate, requireRole('ADMIN'), paymentController.listPending.bind(paymentController));
router.post('/:id/confirm', authenticate, requireRole('ADMIN'), paymentController.confirm.bind(paymentController));

// Cliente
router.post('/create', authenticate, paymentController.create.bind(paymentController));
router.post('/:id/proof', authenticate, uploadProof, paymentController.uploadProof.bind(paymentController));
router.get('/order/:orderId', authenticate, paymentController.getByOrder.bind(paymentController));
router.get('/:id', authenticate, paymentController.getById.bind(paymentController));

export default router;
