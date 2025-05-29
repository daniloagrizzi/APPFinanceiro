import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { dashboardService, SugerirCortesDto, SugestaoDeCorteDespesaDto } from '@/services/dashboardService';

const DespesaCardSimplified = ({ despesa }: { despesa: SugestaoDeCorteDespesaDto }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex justify-between items-center p-4 border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-red-200 text-red-700 rounded-full font-bold text-lg">
          -
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-gray-800">{formatCurrency(despesa.valor)}</p>
          <p className="text-sm text-gray-700 font-medium">{despesa.descricaoDespesa}</p>
          {despesa.motivo && (
            <p className="text-xs text-red-600 mt-1 bg-red-100 px-2 py-1 rounded-md">
              💡 {despesa.motivo}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <span className="text-xs font-medium text-red-700 bg-red-200 px-2 py-1 rounded-full">
          Corte Sugerido
        </span>
      </div>
    </div>
  );
};

interface FinancialManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialManagerModal = ({ isOpen, onClose }: FinancialManagerModalProps) => {
  const [data, setData] = useState<SugerirCortesDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const fetchGerenciadorData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dashboardService.gerenciadorInteligente();
      console.log('Dados do gerenciador inteligente:', response);
      setData(response);
    } catch (err) {
      console.error('Erro ao buscar dados do gerenciador:', err);
      setError('Erro ao carregar dados do gerenciador. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGerenciadorData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCortesSugeridos = data?.sugestaoDeCorteDespesa.reduce((total, despesa) => total + despesa.valor, 0) || 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2"> Gerenciador Financeiro Inteligente</h2>
              <p className="text-blue-100">Análise personalizada baseada em seus dados financeiros</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Analisando seus dados financeiros...</p>
                <p className="text-gray-500 text-sm mt-2">Isso pode levar alguns segundos</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar análise</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchGerenciadorData}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          ) : data ? (
            <div className="p-6 space-y-8">
              {/* Sugestões de Corte por Tipo */}
              {data.sugestaoReducaoTipoDeDespesa && data.sugestaoReducaoTipoDeDespesa.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingDown className="w-6 h-6 mr-2 text-orange-600" />
                    Reduções Sugeridas por Categoria
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.sugestaoReducaoTipoDeDespesa.map((sugestao, index) => (
                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{sugestao.tipoDespesaDescricao}</p>
                            <p className="text-orange-700 font-bold text-lg">
                              {formatCurrency(sugestao.valorTotalASerReduzido)}
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center font-bold">
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Despesas Sugeridas para Corte */}
              {data.sugestaoDeCorteDespesa && data.sugestaoDeCorteDespesa.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                    Despesas Sugeridas para Corte
                  </h3>
                  <div className="space-y-3">
                    {data.sugestaoDeCorteDespesa.map((despesa, index) => (
                      <DespesaCardSimplified key={index} despesa={despesa} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">🎉 Parabéns!</h4>
                      <p className="text-green-700">
                        Suas despesas estão bem otimizadas! Não identificamos cortes específicos necessários no momento.
                      </p>
                    </div>
                  </div>
                </div>
              )}

             {/* Economia Potencial de cortes */}
              {totalCortesSugeridos > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-2">💰 Economia potencial de cortes</h3>
                      <p className="text-green-700">
                        Seguindo nossas sugestões, você pode economizar até{' '}
                        <span className="font-bold text-2xl">{formatCurrency(totalCortesSugeridos)}</span> por mês com esses cortes
                      </p>
                    </div>
                    <Target className="w-12 h-12 text-green-600" />
                  </div>
                </div>
              )}

              {/* Previsão de Metas */}
              {data.previsaoMetas && data.previsaoMetas.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="font-bold text-purple-800 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    🎯 Acelere suas Metas com os Cortes Sugeridos
                  </h4>
                  <p className="text-purple-700 mb-4 text-sm">
                    Com a economia dos cortes sugeridos, você pode bater suas metas mais rapidamente:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.previsaoMetas.map((meta, index) => (
                      <div key={index} className="bg-white border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-800">{meta.nome}</h5>
                          <div className="w-8 h-8 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                            🎯
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Valor restante</p>
                            <p className="font-bold text-lg text-gray-800">{formatCurrency(meta.valorRestante)}</p>
                          </div>
                          <div className="text-center bg-purple-100 p-3 rounded-lg">
                            <p className="text-sm text-purple-700 mb-1">Pode ser conquistada em:</p>
                            <p className="font-bold text-2xl text-purple-800">
                              {meta.mesesParaBaterMeta} {meta.mesesParaBaterMeta === 1 ? 'mês' : 'meses'}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              ⚡ Usando apenas a economia dos cortes
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo Final */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">📊 Resumo da Análise</h4>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• {data.sugestaoDeCorteDespesa?.length || 0} despesas identificadas para otimização</li>
                      <li>• {data.sugestaoReducaoTipoDeDespesa?.length || 0} categorias com potencial de redução</li>
                      <li>• {data.previsaoMetas?.length || 0} metas podem ser aceleradas</li>
                      <li>• Economia total estimada: {formatCurrency(data?.montanteTotal)}/mês</li>
                      <li>• Economia anual projetada: {formatCurrency(data?.montanteTotal * 12)}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Informações dos Montantes */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">📈 Potencial de Investimento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Investindo com CDI</p>
                    <p className="font-bold text-green-600">{formatCurrency(data.montanteCDI)}</p>
                    <p className="text-xs text-gray-500">em 12 meses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Investindo com SELIC</p>
                    <p className="font-bold text-blue-600">{formatCurrency(data.montanteSELIC)}</p>
                    <p className="text-xs text-gray-500">em 12 meses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Investindo com IPCA</p>
                    <p className="font-bold text-yellow-600">{formatCurrency(data.montanteIPCA )}</p>
                    <p className="text-xs text-gray-500">em 12 meses</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
                <p className="text-gray-600">Não foi possível carregar os dados do gerenciador.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              💡 Dica: Revise suas despesas regularmente para manter suas finanças otimizadas
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagerModal;