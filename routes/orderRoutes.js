import { Router } from 'express';
import { list, receipt } from '../controllers/orderController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.get('/orders', requireLogin, list);
router.get('/orders/:id/receipt', requireLogin, receipt);

export default router;

