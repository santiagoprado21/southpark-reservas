import { Router } from 'express';
import {
  getDisponibilidad,
  verificarDisponibilidad,
} from '../controllers/disponibilidad.controller';

const router = Router();

// Rutas públicas
router.get('/verificar', verificarDisponibilidad);
router.get('/:canchaId/:fecha', getDisponibilidad);

export default router;

