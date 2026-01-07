import { Router } from 'express';
import {
  createBloqueo,
  getBloqueos,
  getBloqueoById,
  updateBloqueo,
  deleteBloqueo,
} from '../controllers/bloqueos.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate, requireAdmin);

router.post('/', createBloqueo);
router.get('/', getBloqueos);
router.get('/:id', getBloqueoById);
router.put('/:id', updateBloqueo);
router.delete('/:id', deleteBloqueo);

export default router;

