import api from './api';

interface ForgotPasswordData {
  email: string;
  frontendBaseUrl: string;
}
interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}
interface LoginData {
  userName: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },

  async register(data: { username: string; email: string; password: string }) {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  async getUserInfo() {
    const response = await api.get('/Auth/buscarUsuario');
    return response.data;
  },
  
  async refreshToken(token: string, refreshToken: string) {
    const response = await api.post('/Auth/refresh-token', {
      accessToken: token,
      refreshToken: refreshToken
    });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData) {
    const response = await api.post('/Auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post('/Auth/reset-password', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }
};