import { Router, raw } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Webhook tem de ser registado ANTES do express.json() global
// porque precisa do body RAW para verificar assinatura HMAC.
// Vamos usar body raw APENAS para este endpoint.
router.post(
  '/webhook',
  raw({ type: 'application/json' }),
  (req, res, next) => {
    // Converter Buffer em JSON
    try {
      req.body = JSON.parse(req.body.toString());
    } catch {
      // Se falhar, deixa como está
    }
    next();
  },
  paymentController.webhook.bind(paymentController)
);

// Endpoint de teste (só em dev)
router.post(
  '/webhook/test',
  paymentController.webhookTest.bind(paymentController)
);

// Rotas autenticadas
router.post('/create', authenticate, paymentController.create.bind(paymentController));
router.get('/order/:orderId', authenticate, paymentController.getByOrder.bind(paymentController));
router.get('/:id', authenticate, paymentController.getById.bind(paymentController));

export default router;
