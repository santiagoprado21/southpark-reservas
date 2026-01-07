import { Router } from 'express';
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate, requireAdmin);

router.post('/', createUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;

