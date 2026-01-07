import api from '@/lib/api';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  role: 'ADMIN' | 'EMPLEADO';
  servicioAsignado?: 'TODOS' | 'VOLEY_PLAYA' | 'MINI_GOLF';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioData {
  email: string;
  password: string;
  nombre: string;
  role: 'ADMIN' | 'EMPLEADO';
  servicioAsignado?: 'TODOS' | 'VOLEY_PLAYA' | 'MINI_GOLF';
}

export interface UpdateUsuarioData {
  email?: string;
  password?: string;
  nombre?: string;
  role?: 'ADMIN' | 'EMPLEADO';
  servicioAsignado?: 'TODOS' | 'VOLEY_PLAYA' | 'MINI_GOLF';
  activo?: boolean;
}

export const usuariosService = {
  async createUsuario(data: CreateUsuarioData): Promise<Usuario> {
    const response = await api.post('/usuarios', data);
    return response.data.data.usuario;
  },

  async getUsuarios(params?: { role?: string; activo?: boolean }): Promise<Usuario[]> {
    const response = await api.get('/usuarios', { params });
    return response.data.data.usuarios;
  },

  async getUsuarioById(id: string): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data.data.usuario;
  },

  async updateUsuario(id: string, data: UpdateUsuarioData): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data.data.usuario;
  },

  async deleteUsuario(id: string): Promise<Usuario> {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data.data.usuario;
  },
};

