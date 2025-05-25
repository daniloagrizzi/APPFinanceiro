import api from './api';

// Interfaces atualizadas para corresponder ao backend (PascalCase)

export interface RendasComPorcentagemDto {
  Variavel: string;
  ValorTotal: number;
  Porcentagem: number;
}
export interface RendasPorcentagemPorVariavelDto {
  Total: number;
  PorcentagensVariavel: RendasComPorcentagemDto[];
}

export interface TipoDespesaComPorcentagemDto {
  Tipo: string;
  ValorTotal: number;
  Porcentagem: number;
}

export interface DespesasPorcentagemPorTipoDto {
  Total: number;
  PorcentagensPorTipo: TipoDespesaComPorcentagemDto[];
}

interface BalancoFinanceiroDto {
  TotalRenda: number;
  TotalDespesas: number;
  PorcentagemDespesasSobreRenda: number;
}

export const dashboardService = {
  async buscarPorcentagemDeDespesas(): Promise<DespesasPorcentagemPorTipoDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/DashBoard/BuscarPorcentagensDespesasPorTotalDespesa', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Resposta da API dashboard:', response.data);
    return response.data;
  },
async buscarPorcentagemDeRendas(): Promise<RendasPorcentagemPorVariavelDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/DashBoard/GerarPorcentagensPorRendaVariavel', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Resposta da API dashboard:', response.data);
    return response.data;
  },
  async ObterBalancoFinanceiro(): Promise<BalancoFinanceiroDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/DashBoard/ObterBalancoFinanceiro', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};