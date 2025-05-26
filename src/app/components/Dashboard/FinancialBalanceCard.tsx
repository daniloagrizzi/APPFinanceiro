import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { dashboardService, BalancoFinanceiroDto } from '@/services/dashboardService';

const FinancialBalanceCard: React.FC = () => {
  const [balanco, setBalanco] = useState<BalancoFinanceiroDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalanco = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.obterBalancoFinanceiro();
      setBalanco(data);
    } catch (err: any) {
      console.error('Erro ao carregar balanço financeiro:', err);
      
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError('Erro ao carregar dados do balanço financeiro');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanco();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (porcentagem: number): string => {
    if (porcentagem <= 50) return 'text-green-600';
    if (porcentagem <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBgColor = (porcentagem: number): string => {
    if (porcentagem <= 50) return 'bg-green-500';
    if (porcentagem <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (porcentagem: number) => {
    if (porcentagem <= 50) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (porcentagem <= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const getStatusMessage = (porcentagem: number): string => {
    if (porcentagem <= 50) return 'Situação financeira excelente!';
    if (porcentagem <= 70) return 'Situação financeira boa, mas atenção!';
    return 'Gastos elevados, considere revisar!';
  };

  const getSaldoRestante = (): number => {
    if (!balanco) return 0;
    return balanco.totalRenda - balanco.totalDespesas;
  };

  const handleRefresh = () => {
    fetchBalanco();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ops! Algo deu errado</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!balanco) return null;

  const saldoRestante = getSaldoRestante();

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100 max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Balanço Financeiro</h2>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-8 h-8 text-blue-600" />
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Total de Renda */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total de Renda</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(balanco.totalRenda)}
            </span>
          </div>
        </div>

        {/* Total de Despesas */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Total de Despesas</span>
            </div>
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(balanco.totalDespesas)}
            </span>
          </div>
        </div>

        {/* Saldo Restante */}
        <div className={`${saldoRestante >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'} rounded-lg p-4 border`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${saldoRestante >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              Saldo Restante
            </span>
            <span className={`text-lg font-bold ${saldoRestante >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(saldoRestante)}
            </span>
          </div>
        </div>

        {/* Porcentagem de Gastos */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">% Gastos sobre Renda</span>
            <span className={`text-2xl font-bold ${getStatusColor(balanco.porcentagemDespesasSobreRenda)}`}>
              {balanco.porcentagemDespesasSobreRenda.toFixed(1)}%
            </span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getStatusBgColor(balanco.porcentagemDespesasSobreRenda)}`}
              style={{ width: `${Math.min(balanco.porcentagemDespesasSobreRenda, 100)}%` }}
            ></div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            {getStatusIcon(balanco.porcentagemDespesasSobreRenda)}
            <span className={`text-xs font-medium ${getStatusColor(balanco.porcentagemDespesasSobreRenda)}`}>
              {getStatusMessage(balanco.porcentagemDespesasSobreRenda)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer com dica */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Mantenha seus gastos abaixo de 70% da renda para uma situação financeira saudável
        </p>
      </div>
    </div>
  );
};

export default FinancialBalanceCard;