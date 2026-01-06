import { Router } from 'express';
import {
  createReserva,
  getReservas,
  getReservaById,
  updateEstadoReserva,
  cancelarReserva,
  completarPago,
} from '../controllers/reservas.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/', createReserva);
router.get('/:id', getReservaById);

// Rutas protegidas (admin)
router.get('/', authenticate, requireAdmin, getReservas);
router.patch('/:id/estado', authenticate, requireAdmin, updateEstadoReserva);
router.delete('/:id', authenticate, requireAdmin, cancelarReserva);
router.post('/:id/pago', authenticate, requireAdmin, completarPago);

export default router;

