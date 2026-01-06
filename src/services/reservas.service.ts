import api from '@/lib/api';
import { Cancha } from './canchas.service';

export interface CreateReservaData {
  canchaId: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  duracionHoras: number;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  cantidadPersonas: number;
  cantidadCircuitos?: number;
  notas?: string;
}

export interface Reserva {
  id: string;
  canchaId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  cantidadPersonas: number;
  cantidadCircuitos: number;
  precioTotal: number;
  montoSena: number;
  pagoCompletado: boolean;
  pagoId?: string;
  metodoPago?: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  notas?: string;
  canceladaAt?: string;
  createdAt: string;
  updatedAt: string;
  cancha: Cancha;
}

export const reservasService = {
  /**
   * Crear una nueva reserva
   */
  async createReserva(data: CreateReservaData): Promise<Reserva> {
    const response = await api.post('/reservas', data);
    return response.data.data.reserva;
  },

  /**
   * Obtener todas las reservas (solo admin)
   */
  async getReservas(params?: {
    canchaId?: string;
    fecha?: string;
    estado?: string;
    email?: string;
    telefono?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reservas: Reserva[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get('/reservas', { params });
    return response.data.data;
  },

  /**
   * Obtener una reserva por ID
   */
  async getReservaById(id: string): Promise<Reserva> {
    const response = await api.get(`/reservas/${id}`);
    return response.data.data.reserva;
  },

  /**
   * Actualizar estado de reserva (solo admin)
   */
  async updateEstadoReserva(
    id: string,
    estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA'
  ): Promise<Reserva> {
    const response = await api.patch(`/reservas/${id}/estado`, { estado });
    return response.data.data.reserva;
  },

  /**
   * Cancelar una reserva (solo admin)
   */
  async cancelarReserva(id: string): Promise<Reserva> {
    const response = await api.delete(`/reservas/${id}`);
    return response.data.data.reserva;
  },

  /**
   * Marcar pago como completado (solo admin)
   */
  async completarPago(
    id: string,
    data: { pagoId?: string; metodoPago?: string }
  ): Promise<Reserva> {
    const response = await api.post(`/reservas/${id}/pago`, data);
    return response.data.data.reserva;
  },
};
