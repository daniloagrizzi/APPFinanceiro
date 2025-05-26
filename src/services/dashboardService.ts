import api from './api';
export interface TipoDespesaComPorcentagemDto {
  Tipo: string;
  ValorTotal: number;
  Porcentagem: number;
}
export interface RendasComPorcentagemDto {
  Variavel: string;
  ValorTotal: number;
  Porcentagem: number;
}
export interface RendasPorcentagemPorVariavelDto {
  Total: number;
  PorcentagensVariavel: RendasComPorcentagemDto[];
}
export interface RendasComPorcentagemDto {
  Variavel: string;
  ValorTotal: number;
  Porcentagem: number;
}
export interface DespesasPorcentagemPorTipoDto {
  Total: number;
  PorcentagensPorTipo: TipoDespesaComPorcentagemDto[];
}

export interface BalancoFinanceiroDto {
  totalRenda: number;
  totalDespesas: number;
  porcentagemDespesasSobreRenda: number;
}

export const dashboardService = {
  async buscarPorcentagemDeDespesas(): Promise<DespesasPorcentagemPorTipoDto> {
    const token = localStorage.getItem('accessToken');
    
    console.log('[dashboardService] Iniciando chamada da API para buscar porcentagens');
    
    try {
      const response = await api.get('/DashBoard/BuscarPorcentagensDespesasPorTotalDespesa', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('[dashboardService] Resposta bruta da API dashboard:', response);
      console.log('[dashboardService] Dados retornados:', response.data);
      console.log('[dashboardService] Tipo dos dados:', typeof response.data);
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          console.log('[dashboardService] Dados retornados como array de tamanho:', response.data.length);
          if (response.data.length > 0) {
            console.log('[dashboardService] Primeiro item do array:', response.data[0]);
            if (response.data[0].PorcentagensPorTipo) {
              console.log('[dashboardService] PorcentagensPorTipo encontrado no primeiro item do array');
              console.log('[dashboardService] Conteúdo:', response.data[0].PorcentagensPorTipo);
            } else if (response.data[0].porcentagensPorTipo) {
              console.log('[dashboardService] porcentagensPorTipo (camelCase) encontrado no primeiro item do array');
              console.log('[dashboardService] Conteúdo:', response.data[0].porcentagensPorTipo);
            } else {
              console.log('[dashboardService] Nenhum campo de porcentagens encontrado no primeiro item');
              console.log('[dashboardService] Chaves disponíveis:', Object.keys(response.data[0]));
            }
          }
        } else {
          console.log('[dashboardService] Dados retornados como objeto');
          if (response.data.PorcentagensPorTipo) {
            console.log('[dashboardService] PorcentagensPorTipo encontrado no objeto');
            console.log('[dashboardService] Conteúdo:', response.data.PorcentagensPorTipo);
          } else if (response.data.porcentagensPorTipo) {
            console.log('[dashboardService] porcentagensPorTipo (camelCase) encontrado no objeto');
            console.log('[dashboardService] Conteúdo:', response.data.porcentagensPorTipo);
          } else {
            console.log('[dashboardService] Nenhum campo de porcentagens encontrado no objeto');
            console.log('[dashboardService] Chaves disponíveis:', Object.keys(response.data));
          }
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('[dashboardService] Erro ao buscar porcentagens:', error);
      throw error;
    }
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
  async obterBalancoFinanceiro(): Promise<BalancoFinanceiroDto> {
    const token = localStorage.getItem('accessToken');
    
    console.log('[dashboardService] Iniciando chamada da API para obter balanço financeiro');
    
    try {
      const response = await api.get('/DashBoard/ObterBalancoFinanceiro', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('[dashboardService] Resposta da API balanço financeiro:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[dashboardService] Erro ao obter balanço financeiro:', error);
      throw error;
    }
  },
};