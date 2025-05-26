'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardService, RelatorioMensalDto } from '@/services/dashboardService';
import GraficoEvolucaoMensal from './GraficoEvolucaoMensal';

export default function MonthlyEvolutionCard() {
  const [dados, setDados] = useState<RelatorioMensalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dadosRelatorio = await dashboardService.gerarRelatoriosMensais();
        
        // Se retornar um único objeto, converte para array
        const dadosArray = Array.isArray(dadosRelatorio) ? dadosRelatorio : [dadosRelatorio];
        
        setDados(dadosArray);
      } catch (error) {
        console.error('Erro ao buscar dados do relatório mensal:', error);
        setError('Erro ao carregar dados do relatório mensal');
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  if (loading) {
    return (
      <div className="w-[95vw] h-[95vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-2xl font-medium">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[95vw] h-[95vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar dados</h3>
            <p className="text-red-600 mb-6 text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-xl font-semibold shadow-lg"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <GraficoEvolucaoMensal data={dados} />;
}