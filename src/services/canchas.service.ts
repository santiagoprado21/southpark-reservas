import api from '@/lib/api';

export interface Cancha {
  id: string;
  nombre: string;
  tipo: 'VOLEY_PLAYA' | 'MINI_GOLF';
  descripcion?: string;
  capacidadMaxima?: number;
  activa: boolean;
  orden: number;
  diasOperacion: string[];
  horaApertura: string;
  horaCierre: string;
  configuraciones: ConfiguracionCancha[];
}

export interface ConfiguracionCancha {
  id: string;
  precioHora1?: number;
  precioHora2?: number;
  precioHora3?: number;
  tieneHappyHour: boolean;
  happyHourInicio?: string;
  happyHourFin?: string;
  precioHora2HappyHour?: number;
  precioPersona1Circuito?: number;
  precioPersona2Circuitos?: number;
  activa: boolean;
}

export const canchasService = {
  /**
   * Obtener todas las canchas
   */
  async getCanchas(tipo?: 'VOLEY_PLAYA' | 'MINI_GOLF'): Promise<Cancha[]> {
    const params = tipo ? { tipo } : {};
    const response = await api.get('/canchas', { params });
    return response.data.data.canchas;
  },

  /**
   * Obtener una cancha por ID
   */
  async getCanchaById(id: string): Promise<Cancha> {
    const response = await api.get(`/canchas/${id}`);
    return response.data.data.cancha;
  },

  /**
   * Crear una cancha (solo admin)
   */
  async createCancha(data: Partial<Cancha>): Promise<Cancha> {
    const response = await api.post('/canchas', data);
    return response.data.data.cancha;
  },

  /**
   * Actualizar una cancha (solo admin)
   */
  async updateCancha(id: string, data: Partial<Cancha>): Promise<Cancha> {
    const response = await api.put(`/canchas/${id}`, data);
    return response.data.data.cancha;
  },

  /**
   * Desactivar una cancha (solo admin)
   */
  async deleteCancha(id: string): Promise<Cancha> {
    const response = await api.delete(`/canchas/${id}`);
    return response.data.data.cancha;
  },

  /**
   * Actualizar configuración de precios (solo admin)
   */
  async updateConfiguracion(
    canchaId: string,
    data: Partial<ConfiguracionCancha>
  ): Promise<ConfiguracionCancha> {
    const response = await api.post(`/canchas/${canchaId}/configuracion`, data);
    return response.data.data.configuracion;
  },
};

