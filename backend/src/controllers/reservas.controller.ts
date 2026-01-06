import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { successResponse, errorResponse } from '../utils/responses';
import { parse, format } from 'date-fns';

// Schema de validación
const createReservaSchema = z.object({
  canchaId: z.string(),
  fecha: z.string(), // YYYY-MM-DD
  horaInicio: z.string(), // HH:mm
  duracionHoras: z.number().min(1).max(3),
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  emailCliente: z.string().email('Email inválido'),
  telefonoCliente: z.string().min(8, 'Teléfono inválido'),
  cantidadPersonas: z.number().min(1),
  cantidadCircuitos: z.number().optional(),
  notas: z.string().optional(),
});

/**
 * Calcular precio de una reserva
 */
function calcularPrecio(
  tipo: string,
  duracionHoras: number,
  cantidadPersonas: number,
  cantidadCircuitos: number,
  config: any,
  horaInicio: string
): number {
  if (tipo === 'VOLEY_PLAYA') {
    // Verificar si es Happy Hour (4pm-8pm)
    const hora = parseInt(horaInicio.split(':')[0]);
    const esHappyHour = config.tieneHappyHour && hora >= 16 && hora < 20;

    if (duracionHoras === 1) return config.precioHora1 || 80000;
    if (duracionHoras === 2) {
      if (esHappyHour && config.precioHora2HappyHour) {
        return config.precioHora2HappyHour; // $110,000
      }
      return config.precioHora2 || 130000; // $130,000
    }
    if (duracionHoras === 3) return config.precioHora3 || 180000;

    return config.precioHora1 * duracionHoras;
  }

  if (tipo === 'MINI_GOLF') {
    const precioPorPersona =
      cantidadCircuitos === 2
        ? config.precioPersona2Circuitos || 45000
        : config.precioPersona1Circuito || 25000;

    return precioPorPersona * cantidadPersonas;
  }

  return 0;
}

/**
 * Calcular hora fin basado en hora inicio y duración
 */
function calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
  const baseDate = '2024-01-01';
  const inicio = parse(`${baseDate} ${horaInicio}`, 'yyyy-MM-dd HH:mm', new Date());
  inicio.setMinutes(inicio.getMinutes() + duracionMinutos);
  return format(inicio, 'HH:mm');
}

/**
 * Validar disponibilidad de la cancha
 */
async function validarDisponibilidad(
  canchaId: string,
  fecha: Date,
  horaInicio: string,
  horaFin: string
): Promise<{ disponible: boolean; motivo?: string }> {
  // Verificar reservas existentes
  const reservasConflicto = await prisma.reserva.findFirst({
    where: {
      canchaId,
      fecha,
      estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
      OR: [
        {
          AND: [
            { horaInicio: { lte: horaInicio } },
            { horaFin: { gt: horaInicio } },
          ],
        },
        {
          AND: [
            { horaInicio: { lt: horaFin } },
            { horaFin: { gte: horaFin } },
          ],
        },
        {
          AND: [
            { horaInicio: { gte: horaInicio } },
            { horaFin: { lte: horaFin } },
          ],
        },
      ],
    },
  });

  if (reservasConflicto) {
    return {
      disponible: false,
      motivo: 'El horario ya está reservado',
    };
  }

  // Verificar bloqueos
  const bloqueoConflicto = await prisma.bloqueo.findFirst({
    where: {
      canchaId,
      fecha,
      activo: true,
      OR: [
        {
          AND: [
            { horaInicio: { lte: horaInicio } },
            { horaFin: { gt: horaInicio } },
          ],
        },
        {
          AND: [
            { horaInicio: { lt: horaFin } },
            { horaFin: { gte: horaFin } },
          ],
        },
        {
          AND: [
            { horaInicio: { gte: horaInicio } },
            { horaFin: { lte: horaFin } },
          ],
        },
      ],
    } as any,
  });

  if (bloqueoConflicto) {
    return {
      disponible: false,
      motivo: `Cancha bloqueada: ${bloqueoConflicto.motivo}`,
    };
  }

  return { disponible: true };
}

/**
 * Crear una nueva reserva
 * POST /api/reservas
 */
export const createReserva = async (req: Request, res: Response) => {
  try {
    const data = createReservaSchema.parse(req.body);

    // Obtener cancha con configuración
    const cancha = await prisma.cancha.findUnique({
      where: { id: data.canchaId },
      include: {
        configuraciones: { where: { activa: true } },
      },
    });

    if (!cancha || !cancha.activa) {
      return errorResponse(res, 'Cancha no disponible', 400);
    }

    if (cancha.configuraciones.length === 0) {
      return errorResponse(res, 'Cancha sin configuración activa', 400);
    }

    const config = cancha.configuraciones[0];
    const fechaDate = new Date(data.fecha + 'T00:00:00');

    // Validar que la fecha sea futura
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaDate < hoy) {
      return errorResponse(res, 'No se pueden hacer reservas en fechas pasadas', 400);
    }

    // Calcular hora fin
    const duracionMinutos = data.duracionHoras * 60;
    const horaFin = calcularHoraFin(data.horaInicio, duracionMinutos);

    // Validar disponibilidad
    const validacion = await validarDisponibilidad(
      data.canchaId,
      fechaDate,
      data.horaInicio,
      horaFin
    );

    if (!validacion.disponible) {
      return errorResponse(res, validacion.motivo || 'Horario no disponible', 400);
    }

    // Calcular precio
    const precioTotal = calcularPrecio(
      cancha.tipo,
      data.duracionHoras,
      data.cantidadPersonas,
      data.cantidadCircuitos || 1,
      config,
      data.horaInicio
    );

    // Calcular seña (30%)
    const porcentajeSena = 30;
    const montoSena = Math.round((precioTotal * porcentajeSena) / 100);

    // Crear reserva
    const reserva = await prisma.reserva.create({
      data: {
        canchaId: data.canchaId,
        fecha: fechaDate,
        horaInicio: data.horaInicio,
        horaFin,
        duracionHoras: data.duracionHoras,
        nombreCliente: data.nombreCliente,
        emailCliente: data.emailCliente,
        telefonoCliente: data.telefonoCliente,
        cantidadPersonas: data.cantidadPersonas,
        cantidadCircuitos: data.cantidadCircuitos || 1,
        precioTotal,
        montoSena,
        pagoCompletado: false,
        estado: 'PENDIENTE',
        notas: data.notas,
      },
      include: {
        cancha: true,
      },
    });

    return successResponse(
      res,
      { reserva },
      'Reserva creada exitosamente. Proceda con el pago de la seña.',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, 'Datos inválidos', 400, error.errors);
    }
    console.error('Error al crear reserva:', error);
    return errorResponse(res, 'Error al crear reserva', 500);
  }
};

/**
 * Obtener todas las reservas (con filtros)
 * GET /api/reservas
 */
export const getReservas = async (req: Request, res: Response) => {
  try {
    const {
      canchaId,
      fecha,
      estado,
      email,
      telefono,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (canchaId) where.canchaId = canchaId;
    if (fecha) where.fecha = new Date((fecha as string) + 'T00:00:00');
    if (estado) where.estado = estado;
    if (email) where.emailCliente = { contains: email as string, mode: 'insensitive' };
    if (telefono) where.telefonoCliente = { contains: telefono as string };

    const [reservas, total] = await Promise.all([
      prisma.reserva.findMany({
        where,
        include: {
          cancha: true,
        },
        orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
        skip,
        take: limitNum,
      }),
      prisma.reserva.count({ where }),
    ]);

    return successResponse(res, {
      reservas,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return errorResponse(res, 'Error al obtener reservas', 500);
  }
};

/**
 * Obtener una reserva por ID
 * GET /api/reservas/:id
 */
export const getReservaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: {
        cancha: {
          include: {
            configuraciones: true,
          },
        },
      },
    });

    if (!reserva) {
      return errorResponse(res, 'Reserva no encontrada', 404);
    }

    return successResponse(res, { reserva });
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    return errorResponse(res, 'Error al obtener reserva', 500);
  }
};

/**
 * Actualizar estado de una reserva
 * PATCH /api/reservas/:id/estado
 */
export const updateEstadoReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'].includes(estado)) {
      return errorResponse(res, 'Estado inválido', 400);
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: {
        estado,
        ...(estado === 'CANCELADA' && { canceladaAt: new Date() }),
      },
      include: { cancha: true },
    });

    return successResponse(res, { reserva }, `Reserva ${estado.toLowerCase()} exitosamente`);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return errorResponse(res, 'Error al actualizar reserva', 500);
  }
};

/**
 * Cancelar una reserva
 * DELETE /api/reservas/:id
 */
export const cancelarReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reserva) {
      return errorResponse(res, 'Reserva no encontrada', 404);
    }

    if (reserva.estado === 'CANCELADA') {
      return errorResponse(res, 'La reserva ya está cancelada', 400);
    }

    if (reserva.estado === 'COMPLETADA') {
      return errorResponse(res, 'No se puede cancelar una reserva completada', 400);
    }

    const reservaActualizada = await prisma.reserva.update({
      where: { id },
      data: {
        estado: 'CANCELADA',
        canceladaAt: new Date(),
      },
    });

    return successResponse(res, { reserva: reservaActualizada }, 'Reserva cancelada exitosamente');
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    return errorResponse(res, 'Error al cancelar reserva', 500);
  }
};

/**
 * Marcar pago como completado
 * POST /api/reservas/:id/pago
 */
export const completarPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pagoId, metodoPago = 'EFECTIVO' } = req.body;

    const reserva = await prisma.reserva.update({
      where: { id },
      data: {
        pagoCompletado: true,
        pagoId: pagoId || null,
        metodoPago,
        estado: 'CONFIRMADA',
      } as any,
      include: { cancha: true },
    });

    return successResponse(res, { reserva }, 'Pago registrado exitosamente. Reserva confirmada.');
  } catch (error) {
    console.error('Error al completar pago:', error);
    return errorResponse(res, 'Error al procesar pago', 500);
  }
};

