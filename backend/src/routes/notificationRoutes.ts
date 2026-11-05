import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));
router.get('/', notificationController.getCounts.bind(notificationController));

export default router;
