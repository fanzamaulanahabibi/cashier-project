import { Router } from 'express';
import { pageList, create, update, remove, apiCreate, apiDelete } from '../controllers/productController.js';
import { requireLogin, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/products', requireLogin, pageList);
router.post('/products', requireLogin, requireAdmin, create);
router.post('/products/:id/update', requireLogin, requireAdmin, update);
router.post('/products/:id/delete', requireLogin, requireAdmin, remove);

router.post('/api/products', requireLogin, requireAdmin, apiCreate);
router.delete('/api/products/:id', requireLogin, requireAdmin, apiDelete);

export default router;

