import api from './api';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';

export const despesaService = {
  async listarPorUsuario(): Promise<DespesaDto[]> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/Despesa/ListarPorUsuario', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async adicionarDespesa(data: DespesaDto): Promise<DespesaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.post('/Despesa/AdicionarDespesa', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async obterDespesaPorId(id: number): Promise<DespesaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/Despesa/ObterPorId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  async atualizarDespesa(data: DespesaDto): Promise<DespesaDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.put(`/Despesa/AtualizarDespesa`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deletarDespesa(id: number): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await api.delete(`/Despesa/DeletarDespesa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};