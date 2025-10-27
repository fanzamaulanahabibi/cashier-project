import { Router } from 'express';
import { getPos, checkout } from '../controllers/posController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.get('/pos', requireLogin, getPos);
router.post('/pos/checkout', requireLogin, checkout);

export default router;

