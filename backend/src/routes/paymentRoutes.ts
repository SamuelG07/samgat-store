import { Router, raw } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { uploadProof } from '../middleware/upload';

const router = Router();

router.post(
  '/webhook',
  raw({ type: 'application/json' }),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch {}
    next();
  },
  paymentController.webhook.bind(paymentController)
);

router.post('/webhook/test', paymentController.webhookTest.bind(paymentController));

router.get('/pending', authenticate, requireRole('ADMIN'), paymentController.listPending.bind(paymentController));
router.post('/:id/confirm', authenticate, requireRole('ADMIN'), paymentController.confirm.bind(paymentController));

router.post('/create', authenticate, paymentController.create.bind(paymentController));
router.post(
  '/:id/proof',
  authenticate,
  uploadProof,
  paymentController.uploadProof.bind(paymentController)
);
router.get('/order/:orderId', authenticate, paymentController.getByOrder.bind(paymentController));
router.get('/:id', authenticate, paymentController.getById.bind(paymentController));

export default router;
