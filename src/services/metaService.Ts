import api from './api';
import { MetaDto } from '@/Interfaces/Meta/MetaDto';

export const metaService ={
async listarPorUsuario(): Promise<MetaDto[]> {
    const response = await api.get('/Meta/ListarUsuario');
    return response.data;
  },
  async adicionarMeta(data: MetaDto): Promise<MetaDto> {
    const response = await api.post('/Meta/AdicionarMeta', data);
    return response.data;
  },

  async obterMetaPorId(id: number): Promise<MetaDto> {
    const response = await api.get(`/Meta/BuscarMetaPorId/${id}`);
    return response.data;
  },
  async atualizarMeta(data: MetaDto): Promise<MetaDto> {
    const response = await api.put(`/Meta/AtualizarMeta/`,data);
    return response.data;
  },

  async deletarMeta(id: number): Promise<void> {
    const response = await api.delete(`/Meta/DeletarMeta/${id}`);
  }
}

