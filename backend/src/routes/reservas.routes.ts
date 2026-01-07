import { Router } from 'express';
import {
  createReserva,
  getReservas,
  getReservaById,
  updateReserva,
  updateEstadoReserva,
  cancelarReserva,
  completarPago,
} from '../controllers/reservas.controller';
import { authenticate, requireAdmin, requireStaff } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/', createReserva);
router.get('/:id', getReservaById);

// Rutas protegidas - Ver reservas (ADMIN + EMPLEADO)
router.get('/', authenticate, requireStaff, getReservas);

// Rutas protegidas - Modificar reservas (solo ADMIN)
router.put('/:id', authenticate, requireAdmin, updateReserva);
router.patch('/:id/estado', authenticate, requireAdmin, updateEstadoReserva);
router.delete('/:id', authenticate, requireAdmin, cancelarReserva);
router.post('/:id/pago', authenticate, requireAdmin, completarPago);

export default router;

