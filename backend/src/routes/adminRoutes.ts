import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// TODAS as rotas admin exigem autenticação + role ADMIN
router.use(authenticate);
router.use(requireRole('ADMIN'));

// ===== DASHBOARD =====
router.get('/dashboard', adminController.getDashboard.bind(adminController));

// ===== PRODUCTS =====
router.get('/products', adminController.getProducts.bind(adminController));
router.patch('/products/:id/activate', adminController.activateProduct.bind(adminController));
router.patch('/products/:id/deactivate', adminController.deactivateProduct.bind(adminController));

// ===== INVENTORY =====
router.get('/inventory', adminController.getInventory.bind(adminController));
router.post('/inventory/:productId/in', adminController.stockIn.bind(adminController));
router.post('/inventory/:productId/adjust', adminController.stockAdjust.bind(adminController));

// ===== STOCK MOVEMENTS =====
router.get('/stock-movements', adminController.getStockMovements.bind(adminController));

// ===== ORDERS =====
router.get('/orders', adminController.getOrders.bind(adminController));
router.get('/orders/:id', adminController.getOrderById.bind(adminController));
router.put('/orders/:id/status', adminController.updateOrderStatus.bind(adminController));
router.put('/orders/:id/payment-status', adminController.updatePaymentStatus.bind(adminController));

// ===== USERS =====
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));

export default router;
