import api from './api';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';

export const rendaService ={
async listarPorUsuario(): Promise<RendaDto[]> {
    const response = await api.get('/Renda/ListarUsuario');
    return response.data;
  },
  async adicionarRenda(data: RendaDto): Promise<RendaDto> {
    const response = await api.post('/Renda/AdicionarRenda', data);
    return response.data;
  },

  async obterRendaPorId(id: number): Promise<RendaDto> {
    const response = await api.get(`/Renda/BuscarRendaPorId/${id}`);
    return response.data;
  },
  async atualizarRenda(data: RendaDto): Promise<RendaDto> {
    const response = await api.put(`/Renda/AtualizarRenda/`,data);
    return response.data;
  },

  async deletarRenda(id: number): Promise<void> {
    const response = await api.delete(`/Meta/DeletarRenda/${id}`);
  }
}
