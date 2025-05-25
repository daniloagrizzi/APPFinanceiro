import api from './api';
import { MetaDto } from '@/Interfaces/Meta/MetaDto';

export const metaService = {
  async listarPorUsuario(): Promise<MetaDto[]> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/Meta/ListarPorUsuario', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async adicionarMeta(data: MetaDto): Promise<MetaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.post('/Meta/AdicionarMeta', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async obterMetaPorId(id: number): Promise<MetaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/Meta/ObterPorId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async atualizarMeta(data: MetaDto): Promise<MetaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.put(`/Meta/AtualizarMeta`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deletarMeta(id: number): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await api.delete(`/Meta/DeletarMeta/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
