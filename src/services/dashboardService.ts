import api from './api';

export interface TipoDespesaComPorcentagemDto {
  Tipo: string;
  ValorTotal: number;
  Porcentagem: number;
}

// Interface corrigida para rendas - removendo duplicação
export interface RendasComPorcentagemDto {
  Variavel: boolean;
  ValorTotal: number;
  Porcentagem: number;
}

export interface RendasPorcentagemPorVariavelDto {
  Total: number;
  PorcentagensPorVariavel: RendasComPorcentagemDto[];
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

export interface RelatorioMensalDto {
  ano: number;
  mes: number;
  totalRenda: number;
  totalDespesas: number;
  saldo: number;
}

export interface PrevisaoMetasDto {
  nome: string;
  valorRestante: number;
  mesesParaBaterMeta: number;
}

export interface SugerirCortesDto {
  montanteCDI: number;
  montanteSELIC: number;
  montanteIPCA: number;
  montanteTotal: number;
  sugestaoDeCorteDespesa: SugestaoDeCorteDespesaDto[];
  sugestaoReducaoTipoDeDespesa: SugestaoReducaoTipoDeDespesaDto[];
  previsaoMetas: PrevisaoMetasDto[];
}

export interface SugestaoReducaoTipoDeDespesaDto {
  tipoDespesaDescricao: string;
  valorTotalASerReduzido: number;
}

export interface SugestaoDeCorteDespesaDto {
  despesaId: number;
  descricaoDespesa: string;
  valor: number;
  motivo?: string;
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
      
      return response.data;
    } catch (error) {
      console.error('[dashboardService] Erro ao buscar porcentagens:', error);
      throw error;
    }
  },

  async gerarRelatoriosMensais(): Promise<RelatorioMensalDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/DashBoard/GerarRelatoriosMensais', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Resposta da API dashboard:', response.data);
    return response.data;
  },

  async gerenciadorInteligente(): Promise<SugerirCortesDto> {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/DashBoard/gerenciadorInteligente', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Resposta da API dashboard:', response.data);
    return response.data;
  },

  async buscarPorcentagemDeRendas(): Promise<RendasPorcentagemPorVariavelDto> {
    const token = localStorage.getItem('accessToken');
    
    console.log('[dashboardService] Iniciando chamada da API para buscar porcentagens de rendas');
    
    try {
      const response = await api.get('/DashBoard/GerarPorcentagensPorRendaVariavel', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('[dashboardService] Resposta da API porcentagens de rendas:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[dashboardService] Erro ao buscar porcentagens de rendas:', error);
      throw error;
    }
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