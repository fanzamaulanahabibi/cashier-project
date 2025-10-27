import { Router } from 'express';
import { daily, exportCsv, monthly } from '../controllers/reportController.js';
import { requireLogin, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/reports/daily', requireLogin, daily);
router.get('/reports/export.csv', requireLogin, requireAdmin, exportCsv);
router.get('/reports/monthly', requireLogin, monthly);

export default router;

