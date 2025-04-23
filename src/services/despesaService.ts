import api from './api';
import { DespesaDto} from '@/Interfaces/Despesa/DespesaDto';

export const despesaService = {

    async listarPorUsuario(): Promise<DespesaDto[]> {
    const response = await api.get('/Despesa/ListarUsuario');
    return response.data;
  },

  
  async adicionarDespesa(data: DespesaDto): Promise<DespesaDto> {
    const response = await api.post('/Despesa/AdicionarDespesa', data);
    return response.data;
  },

  async obterDespesaPorId(id: number): Promise<DespesaDto> {
    const response = await api.get(`/Despesa/ObterPorId/${id}`);
    return response.data;
  },

  async deletarDespesa(id: number): Promise<void> {
    const response = await api.delete(`/Despesa/DeletarDespesa/${id}`);
  }
}