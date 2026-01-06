import { Router } from 'express';
import {
  getCanchas,
  getCanchaById,
  createCancha,
  updateCancha,
  deleteCancha,
  updateConfiguracion,
} from '../controllers/canchas.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', getCanchas);
router.get('/:id', getCanchaById);

// Rutas protegidas (solo admin)
router.post('/', authenticate, requireAdmin, createCancha);
router.put('/:id', authenticate, requireAdmin, updateCancha);
router.delete('/:id', authenticate, requireAdmin, deleteCancha);
router.post('/:id/configuracion', authenticate, requireAdmin, updateConfiguracion);

export default router;

