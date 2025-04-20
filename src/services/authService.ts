import api from './api';

interface LoginData {
  userName: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  async refreshToken(token: string, refreshToken: string) {
    const response = await api.post('/Auth/refresh-token', {
      accessToken: token,
      refreshToken: refreshToken
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }
};