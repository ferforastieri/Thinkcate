import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
}

export const authService = {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  // Verificar token
  async verifyToken(): Promise<{ user: any }> {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Atualizar perfil
  async updateProfile(data: { name?: string; avatar?: string }): Promise<{ user: any }> {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },

  // Alterar senha
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.patch('/auth/password', data);
  },

  // Esqueci minha senha
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  // Resetar senha
  async resetPassword(data: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', data);
  },
};
