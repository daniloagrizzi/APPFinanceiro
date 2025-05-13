import api from './api';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';

export const rendaService = {
  async listarPorUsuario(): Promise<RendaDto[]> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/Renda/ListarPorUsuario', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async adicionarRenda(data: RendaDto): Promise<RendaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.post('/Renda/AdicionarRenda', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async obterRendaPorId(id: number): Promise<RendaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/Renda/BuscarRendaPorId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async atualizarRenda(data: RendaDto): Promise<RendaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.put(`/Renda/AtualizarRenda`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deletarRenda(id: number): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await api.delete(`/Renda/DeletarRenda/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
