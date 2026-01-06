import api from '@/lib/api';

export interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  motivo?: string;
}

export interface DisponibilidadResponse {
  disponible: boolean;
  cancha?: {
    id: string;
    nombre: string;
    tipo: string;
  };
  fecha?: string;
  horarios?: HorarioDisponible[];
  motivo?: string;
}

export interface VerificarDisponibilidadParams {
  canchaId: string;
  fecha: string;
  horaInicio: string;
  duracionHoras: number;
}

export const disponibilidadService = {
  /**
   * Obtener disponibilidad de una cancha en una fecha
   */
  async getDisponibilidad(
    canchaId: string,
    fecha: string
  ): Promise<DisponibilidadResponse> {
    const response = await api.get(`/disponibilidad/${canchaId}/${fecha}`);
    return response.data.data;
  },

  /**
   * Verificar si un horario específico está disponible
   */
  async verificarDisponibilidad(
    params: VerificarDisponibilidadParams
  ): Promise<{ disponible: boolean; motivo?: string; horaFin?: string }> {
    const response = await api.get('/disponibilidad/verificar', { params });
    return response.data.data;
  },
};

