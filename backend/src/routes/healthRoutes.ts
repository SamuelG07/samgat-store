import { Router } from 'express';
import { healthCheck, simpleHealth } from '../controllers/healthController';

const router = Router();

router.get('/', simpleHealth);
router.get('/db', healthCheck);

export default router;
