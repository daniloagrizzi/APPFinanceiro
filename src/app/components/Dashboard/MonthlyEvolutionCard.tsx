'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <GraficoEvolucaoMensal data={dados} />
    </div>
  );
}