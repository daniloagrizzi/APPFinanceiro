import api from './api';
import { TipoDespesaDto } from '@/Interfaces/TipoDespesa/TipoDespesaDto';

export const tipoDespesaService = {
    async listarTipoDespesas(): Promise<TipoDespesaDto[]> {
        const response = await api.get('/TipoDespesa/GetTipoDespesas');
        const dados = response.data;
        
        const dadosComPrioridade: TipoDespesaDto[] = dados.map((item: any) => ({
          id: item.id,
          descricao: item.descricao,
        }));
      
        return dadosComPrioridade;
      }
      
}