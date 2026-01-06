import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { successResponse, errorResponse } from '../utils/responses';

// Schema de validación
const createCanchaSchema = z.object({
  nombre: z.string().min(2),
  tipo: z.enum(['VOLEY_PLAYA', 'MINI_GOLF']),
  descripcion: z.string().optional(),
  capacidadMaxima: z.number().optional(),
  diasOperacion: z.array(z.string()),
  horaApertura: z.string(), // "16:00"
  horaCierre: z.string(), // "00:00"
  orden: z.number().optional(),
});

/**
 * Obtener todas las canchas
 * GET /api/canchas
 */
export const getCanchas = async (req: Request, res: Response) => {
  try {
    const { tipo, activa } = req.query;

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (activa !== undefined) where.activa = activa === 'true';

    const canchas = await prisma.cancha.findMany({
      where,
      include: {
        configuraciones: {
          where: { activa: true },
        },
      },
      orderBy: { orden: 'asc' },
    });

    return successResponse(res, { canchas }, 'Canchas obtenidas exitosamente');
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    return errorResponse(res, 'Error al obtener canchas', 500);
  }
};

/**
 * Obtener una cancha por ID
 * GET /api/canchas/:id
 */
export const getCanchaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cancha = await prisma.cancha.findUnique({
      where: { id },
      include: {
        configuraciones: {
          where: { activa: true },
        },
      },
    });

    if (!cancha) {
      return errorResponse(res, 'Cancha no encontrada', 404);
    }

    return successResponse(res, { cancha }, 'Cancha obtenida exitosamente');
  } catch (error) {
    console.error('Error al obtener cancha:', error);
    return errorResponse(res, 'Error al obtener cancha', 500);
  }
};

/**
 * Crear una cancha (solo admin)
 * POST /api/canchas
 */
export const createCancha = async (req: Request, res: Response) => {
  try {
    const data = createCanchaSchema.parse(req.body);

    const cancha = await prisma.cancha.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo as any,
        descripcion: data.descripcion,
        capacidadMaxima: data.capacidadMaxima,
        diasOperacion: data.diasOperacion,
        horaApertura: data.horaApertura,
        horaCierre: data.horaCierre,
        orden: data.orden || 0,
        activa: true,
      },
    });

    return successResponse(
      res,
      { cancha },
      'Cancha creada exitosamente',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al crear cancha:', error);
    return errorResponse(res, 'Error al crear cancha', 500);
  }
};

/**
 * Actualizar cancha (solo admin)
 * PUT /api/canchas/:id
 */
export const updateCancha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = createCanchaSchema.partial().parse(req.body);

    const cancha = await prisma.cancha.update({
      where: { id },
      data: data as any,
    });

    return successResponse(res, { cancha }, 'Cancha actualizada exitosamente');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al actualizar cancha:', error);
    return errorResponse(res, 'Error al actualizar cancha', 500);
  }
};

/**
 * Eliminar/desactivar cancha (solo admin)
 * DELETE /api/canchas/:id
 */
export const deleteCancha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - solo desactivar
    const cancha = await prisma.cancha.update({
      where: { id },
      data: { activa: false },
    });

    return successResponse(res, { cancha }, 'Cancha desactivada exitosamente');
  } catch (error) {
    console.error('Error al desactivar cancha:', error);
    return errorResponse(res, 'Error al desactivar cancha', 500);
  }
};

/**
 * Crear/actualizar configuración de precios
 * POST /api/canchas/:id/configuracion
 */
export const updateConfiguracion = async (req: Request, res: Response) => {
  try {
    const { id: canchaId } = req.params;
    const {
      precioHora1,
      precioHora2,
      precioHora3,
      tieneHappyHour,
      happyHourInicio,
      happyHourFin,
      precioHora2HappyHour,
      precioPersona1Circuito,
      precioPersona2Circuitos,
    } = req.body;

    // Desactivar configuraciones anteriores
    await prisma.configuracionCancha.updateMany({
      where: { canchaId, activa: true },
      data: { activa: false },
    });

    // Crear nueva configuración
    const config = await prisma.configuracionCancha.create({
      data: {
        canchaId,
        precioHora1,
        precioHora2,
        precioHora3,
        tieneHappyHour,
        happyHourInicio,
        happyHourFin,
        precioHora2HappyHour,
        precioPersona1Circuito,
        precioPersona2Circuitos,
        activa: true,
      },
    });

    return successResponse(
      res,
      { configuracion: config },
      'Configuración actualizada exitosamente',
      201
    );
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return errorResponse(res, 'Error al actualizar configuración', 500);
  }
};

