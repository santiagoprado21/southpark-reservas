import api from '@/lib/api';

export interface Bloqueo {
  id: string;
  canchaId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  cancha: {
    id: string;
    nombre: string;
    tipo: string;
  };
}

export interface CreateBloqueoData {
  canchaId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
}

export interface UpdateBloqueoData {
  canchaId?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  motivo?: string;
  activo?: boolean;
}

export const bloqueosService = {
  async createBloqueo(data: CreateBloqueoData): Promise<Bloqueo> {
    const response = await api.post('/bloqueos', data);
    return response.data.data.bloqueo;
  },

  async getBloqueos(params?: { canchaId?: string; fecha?: string; activo?: boolean }): Promise<Bloqueo[]> {
    const response = await api.get('/bloqueos', { params });
    return response.data.data.bloqueos;
  },

  async getBloqueoById(id: string): Promise<Bloqueo> {
    const response = await api.get(`/bloqueos/${id}`);
    return response.data.data.bloqueo;
  },

  async updateBloqueo(id: string, data: UpdateBloqueoData): Promise<Bloqueo> {
    const response = await api.put(`/bloqueos/${id}`, data);
    return response.data.data.bloqueo;
  },

  async deleteBloqueo(id: string): Promise<Bloqueo> {
    const response = await api.delete(`/bloqueos/${id}`);
    return response.data.data.bloqueo;
  },
};

