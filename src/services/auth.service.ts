import api from '@/lib/api';

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  role: 'ADMIN' | 'CLIENTE';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  /**
   * Iniciar sesión
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { user, token } = response.data.data;

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};

