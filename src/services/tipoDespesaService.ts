import api from './api';
import { TipoDespesaDto } from '@/Interfaces/TipoDespesa/TipoDespesaDto';

export const tipoDespesaService = {
    async listarTipoDespesas(): Promise<TipoDespesaDto[]>{
        const response = await api.get('/TipoDespesa/GetTipoDespesas');
        return response.data;
    }
}