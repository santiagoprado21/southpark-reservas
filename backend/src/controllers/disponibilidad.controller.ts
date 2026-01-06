import { Request, Response } from 'express';
import { parse, format, addHours } from 'date-fns';
import prisma from '../utils/prisma';
import { successResponse, errorResponse } from '../utils/responses';

/**
 * Obtener disponibilidad de una cancha en una fecha específica
 * GET /api/disponibilidad/:canchaId/:fecha
 */
export const getDisponibilidad = async (req: Request, res: Response) => {
  try {
    const { canchaId, fecha } = req.params;

    // Obtener cancha con configuración
    const cancha = await prisma.cancha.findUnique({
      where: { id: canchaId },
      include: {
        configuraciones: { where: { activa: true } },
      },
    }) as any;

    if (!cancha || !cancha.activa) {
      return errorResponse(res, 'Cancha no encontrada o inactiva', 404);
    }

    // Parsear fecha (agregar tiempo para evitar problemas de timezone)
    const fechaDate = new Date(fecha + 'T00:00:00');
    const diaSemanaIngles = format(fechaDate, 'EEEE').toUpperCase();
    
    // Mapeo de días inglés a español
    const diasMap: { [key: string]: string } = {
      'SUNDAY': 'DOMINGO',
      'MONDAY': 'LUNES',
      'TUESDAY': 'MARTES',
      'WEDNESDAY': 'MIERCOLES',
      'THURSDAY': 'JUEVES',
      'FRIDAY': 'VIERNES',
      'SATURDAY': 'SABADO'
    };
    
    const diaSemana = diasMap[diaSemanaIngles] || diaSemanaIngles;

    // Verificar si la cancha opera ese día
    if (!cancha.diasOperacion.includes(diaSemana)) {
      return successResponse(res, {
        disponible: false,
        motivo: `La cancha no opera los ${diaSemana.toLowerCase()}`,
        horarios: [],
      });
    }

    // Obtener reservas y bloqueos para esa fecha
    const [reservas, bloqueos] = await Promise.all([
      prisma.reserva.findMany({
        where: {
          canchaId,
          fecha: fechaDate,
          estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
        },
        select: {
          horaInicio: true,
          horaFin: true,
        },
      }),
      prisma.bloqueo.findMany({
        where: {
          canchaId,
          fecha: fechaDate,
          activo: true,
        } as any,
        select: {
          horaInicio: true,
          horaFin: true,
          motivo: true,
        },
      }),
    ]);

    // Generar horarios disponibles
    const horarios = generarHorarios(
      cancha.horaApertura,
      cancha.horaCierre,
      reservas,
      bloqueos
    );

    return successResponse(res, {
      disponible: true,
      cancha: {
        id: cancha.id,
        nombre: cancha.nombre,
        tipo: cancha.tipo,
      },
      fecha,
      horarios,
    });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    return errorResponse(res, 'Error al obtener disponibilidad', 500);
  }
};

/**
 * Verificar si un horario específico está disponible
 * GET /api/disponibilidad/verificar
 */
export const verificarDisponibilidad = async (req: Request, res: Response) => {
  try {
    const { canchaId, fecha, horaInicio, duracionHoras } = req.query;

    if (!canchaId || !fecha || !horaInicio || !duracionHoras) {
      return errorResponse(res, 'Faltan parámetros requeridos', 400);
    }

    const fechaDate = new Date((fecha as string) + 'T00:00:00');
    const duracion = parseInt(duracionHoras as string);

    // Calcular hora fin
    const horaFin = calcularHoraFin(horaInicio as string, duracion * 60);

    // Verificar reservas conflictivas
    const reservaConflicto = await prisma.reserva.findFirst({
      where: {
        canchaId: canchaId as string,
        fecha: fechaDate,
        estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
        OR: [
          {
            AND: [
              { horaInicio: { lte: horaInicio as string } },
              { horaFin: { gt: horaInicio as string } },
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
              { horaInicio: { gte: horaInicio as string } },
              { horaFin: { lte: horaFin } },
            ],
          },
        ],
      },
    });

    if (reservaConflicto) {
      return successResponse(res, {
        disponible: false,
        motivo: 'El horario ya está reservado',
      });
    }

    // Verificar bloqueos
    const bloqueoConflicto = await prisma.bloqueo.findFirst({
      where: {
        canchaId: canchaId as string,
        fecha: fechaDate,
        activo: true,
        OR: [
          {
            AND: [
              { horaInicio: { lte: horaInicio as string } },
              { horaFin: { gt: horaInicio as string } },
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
              { horaInicio: { gte: horaInicio as string } },
              { horaFin: { lte: horaFin } },
            ],
          },
        ],
      } as any,
    });

    if (bloqueoConflicto) {
      return successResponse(res, {
        disponible: false,
        motivo: `Cancha bloqueada: ${bloqueoConflicto.motivo}`,
      });
    }

    return successResponse(res, {
      disponible: true,
      horaInicio,
      horaFin,
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return errorResponse(res, 'Error al verificar disponibilidad', 500);
  }
};

/**
 * Generar horarios disponibles de una cancha
 */
function generarHorarios(
  horaApertura: string,
  horaCierre: string,
  reservas: Array<{ horaInicio: string; horaFin: string }>,
  bloqueos: Array<{ horaInicio: string; horaFin: string; motivo: string }>
) {
  const horarios: Array<{
    hora: string;
    disponible: boolean;
    motivo?: string;
  }> = [];

  // Generar horarios cada hora
  const baseDate = '2024-01-01';
  let horaActual = parse(`${baseDate} ${horaApertura}`, 'yyyy-MM-dd HH:mm', new Date());
  const horaFin = parse(`${baseDate} ${horaCierre}`, 'yyyy-MM-dd HH:mm', new Date());

  // Si hora cierre es menor, es del día siguiente
  if (horaFin < horaActual) {
    horaFin.setDate(horaFin.getDate() + 1);
  }

  while (horaActual < horaFin) {
    const horaStr = format(horaActual, 'HH:mm');

    // Verificar si está bloqueado
    const bloqueado = bloqueos.find(
      (b) => horaStr >= b.horaInicio && horaStr < b.horaFin
    );

    if (bloqueado) {
      horarios.push({
        hora: horaStr,
        disponible: false,
        motivo: bloqueado.motivo,
      });
    } else {
      // Verificar si está reservado
      const reservado = reservas.find(
        (r) => horaStr >= r.horaInicio && horaStr < r.horaFin
      );

      horarios.push({
        hora: horaStr,
        disponible: !reservado,
        motivo: reservado ? 'Reservado' : undefined,
      });
    }

    horaActual = addHours(horaActual, 1);
  }

  return horarios;
}

/**
 * Calcular hora fin basado en hora inicio y duración en minutos
 */
function calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
  const baseDate = '2024-01-01';
  const inicio = parse(`${baseDate} ${horaInicio}`, 'yyyy-MM-dd HH:mm', new Date());
  inicio.setMinutes(inicio.getMinutes() + duracionMinutos);
  return format(inicio, 'HH:mm');
}

