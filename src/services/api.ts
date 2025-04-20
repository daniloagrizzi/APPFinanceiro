// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7202/api', // Use https se tiver cert de dev configurado
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // nome padrão do JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // trata erro antes da requisição sair
  }
);

export default api;
