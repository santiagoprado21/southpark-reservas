import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { successResponse, errorResponse } from '../utils/responses';

// Schema de validación
const createBloqueoSchema = z.object({
  canchaId: z.string(),
  fecha: z.string(), // YYYY-MM-DD
  horaInicio: z.string(), // HH:mm
  horaFin: z.string(), // HH:mm
  motivo: z.string().min(3, 'El motivo debe tener al menos 3 caracteres'),
});

const updateBloqueoSchema = z.object({
  canchaId: z.string().optional(),
  fecha: z.string().optional(),
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
  motivo: z.string().min(3).optional(),
  activo: z.boolean().optional(),
});

/**
 * Crear un nuevo bloqueo
 * POST /api/bloqueos
 */
export const createBloqueo = async (req: Request, res: Response) => {
  try {
    const data = createBloqueoSchema.parse(req.body);

    // Validar que la fecha sea válida
    const fechaDate = new Date(data.fecha + 'T00:00:00');
    
    // Validar que horaFin sea posterior a horaInicio
    if (data.horaFin <= data.horaInicio) {
      return errorResponse(res, 'La hora de fin debe ser posterior a la hora de inicio', 400);
    }

    // Verificar que la cancha existe
    const cancha = await prisma.cancha.findUnique({
      where: { id: data.canchaId },
    });

    if (!cancha) {
      return errorResponse(res, 'Cancha no encontrada', 404);
    }

    // Verificar si ya existe un bloqueo en ese horario
    const bloqueoExistente = await prisma.bloqueo.findFirst({
      where: {
        canchaId: data.canchaId,
        fecha: fechaDate,
        activo: true,
        OR: [
          {
            AND: [
              { horaInicio: { lte: data.horaInicio } },
              { horaFin: { gt: data.horaInicio } },
            ],
          },
          {
            AND: [
              { horaInicio: { lt: data.horaFin } },
              { horaFin: { gte: data.horaFin } },
            ],
          },
          {
            AND: [
              { horaInicio: { gte: data.horaInicio } },
              { horaFin: { lte: data.horaFin } },
            ],
          },
        ],
      },
    });

    if (bloqueoExistente) {
      return errorResponse(res, 'Ya existe un bloqueo en ese horario', 400);
    }

    // Crear bloqueo
    const bloqueo = await prisma.bloqueo.create({
      data: {
        canchaId: data.canchaId,
        fecha: fechaDate,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        motivo: data.motivo,
        activo: true,
      },
      include: {
        cancha: true,
      },
    });

    return successResponse(res, { bloqueo }, 'Bloqueo creado exitosamente', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al crear bloqueo:', error);
    return errorResponse(res, 'Error al crear bloqueo', 500);
  }
};

/**
 * Obtener todos los bloqueos (con filtros)
 * GET /api/bloqueos
 */
export const getBloqueos = async (req: Request, res: Response) => {
  try {
    const { canchaId, fecha, activo } = req.query;

    const where: any = {};

    if (canchaId) where.canchaId = canchaId as string;
    if (fecha) where.fecha = new Date(fecha as string + 'T00:00:00');
    if (activo !== undefined) where.activo = activo === 'true';

    const bloqueos = await prisma.bloqueo.findMany({
      where,
      include: {
        cancha: true,
      },
      orderBy: [
        { fecha: 'desc' },
        { horaInicio: 'asc' },
      ],
    });

    return successResponse(res, { bloqueos, total: bloqueos.length });
  } catch (error) {
    console.error('Error al obtener bloqueos:', error);
    return errorResponse(res, 'Error al obtener bloqueos', 500);
  }
};

/**
 * Obtener un bloqueo por ID
 * GET /api/bloqueos/:id
 */
export const getBloqueoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bloqueo = await prisma.bloqueo.findUnique({
      where: { id },
      include: {
        cancha: true,
      },
    });

    if (!bloqueo) {
      return errorResponse(res, 'Bloqueo no encontrado', 404);
    }

    return successResponse(res, { bloqueo });
  } catch (error) {
    console.error('Error al obtener bloqueo:', error);
    return errorResponse(res, 'Error al obtener bloqueo', 500);
  }
};

/**
 * Actualizar un bloqueo
 * PUT /api/bloqueos/:id
 */
export const updateBloqueo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateBloqueoSchema.parse(req.body);

    // Verificar que el bloqueo existe
    const bloqueoExistente = await prisma.bloqueo.findUnique({
      where: { id },
    });

    if (!bloqueoExistente) {
      return errorResponse(res, 'Bloqueo no encontrado', 404);
    }

    // Preparar datos para actualizar
    const updateData: any = { ...data };

    if (data.fecha) {
      updateData.fecha = new Date(data.fecha + 'T00:00:00');
    }

    // Actualizar bloqueo
    const bloqueo = await prisma.bloqueo.update({
      where: { id },
      data: updateData,
      include: {
        cancha: true,
      },
    });

    return successResponse(res, { bloqueo }, 'Bloqueo actualizado exitosamente');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al actualizar bloqueo:', error);
    return errorResponse(res, 'Error al actualizar bloqueo', 500);
  }
};

/**
 * Eliminar (desactivar) un bloqueo
 * DELETE /api/bloqueos/:id
 */
export const deleteBloqueo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bloqueo = await prisma.bloqueo.update({
      where: { id },
      data: { activo: false },
      include: {
        cancha: true,
      },
    });

    return successResponse(res, { bloqueo }, 'Bloqueo eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar bloqueo:', error);
    return errorResponse(res, 'Error al eliminar bloqueo', 500);
  }
};

