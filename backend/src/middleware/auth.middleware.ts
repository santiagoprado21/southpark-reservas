import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { errorResponse } from '../utils/responses';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token no proporcionado', 401);
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Token inválido o expirado', 401);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return errorResponse(res, 'No autenticado', 401);
  }

  if (req.user.role !== 'ADMIN') {
    return errorResponse(res, 'Acceso denegado. Se requieren permisos de administrador', 403);
  }

  next();
};

