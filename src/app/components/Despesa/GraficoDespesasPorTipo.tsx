'use client';

import { useState, useRef, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { TipoDespesaComPorcentagemDto } from '@/services/dashboardService';

interface Props {
  data: any[];
}

const cores = ['#221DAF', '#5A55D5', '#0AD611', '#EF0707', '#FFBB28', '#FF8042', '#636363', '#DDDDDD', '#800080'];

export default function GraficoDespesasPorTipo({ data }: Props) {
  const [expandido, setExpandido] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (expandido && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setExpandido(false);
      }
    }

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [expandido]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 w-full h-[50vh] sm:h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-base mb-2">Nenhum dado disponível para o gráfico.</p>
        </div>
      </div>
    );
  }

  const dadosFormatados = data.map((item, index) => {
    const tipo = item.Tipo || item.tipo || `Tipo ${index + 1}`;
    const porcentagem = typeof item.Porcentagem === 'number' ? item.Porcentagem
                        : typeof item.porcentagem === 'number' ? item.porcentagem
                        : 1;
    const valorTotal = item.ValorTotal || item.valorTotal || 0;

    return {
      id: tipo,
      label: tipo,
      value: parseFloat(porcentagem.toFixed(1)),
      valorOriginal: valorTotal,
      tooltipValue: `${tipo}: ${porcentagem.toFixed(1)}%`,
      color: cores[index % cores.length],
    };
  });

  // Ordenar dados por valor (maior para menor) e pegar apenas os 3 maiores para a legenda quando não expandido
  const dadosOrdenados = [...dadosFormatados].sort((a, b) => b.value - a.value);
  const top3Dados = dadosOrdenados.slice(0, 3);

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full ${
        expandido 
          ? 'h-[95vh] sm:h-[90vh] max-w-full sm:max-w-4xl' 
          : 'h-[70vh] sm:h-[80vh]'
      } flex flex-col justify-between relative`}
    >
      <button
        onClick={() => setExpandido(!expandido)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:opacity-80 transition-opacity cursor-pointer z-10"
      >
        <img
          src={expandido ? '/Icons/close.png' : '/Icons/open_in_full.png'}
          alt={expandido ? 'Fechar' : 'Expandir'}
          className="w-5 h-5 sm:w-6 sm:h-6 filter brightness-0 saturate-100"
        />
      </button>

      <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-2 sm:mb-4 pr-8">
        Distribuição de Despesas
      </h2>

      <div className="flex-grow relative min-h-0">
        <ResponsivePie
          data={dadosFormatados}
          margin={{ 
            top: 10, 
            right: 10, 
            bottom: expandido ? 80 : 60, 
            left: 10 
          }}
          innerRadius={0.55}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={expandido ? 5 : 15}
          arcLinkLabelsTextColor="#1f2937"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={expandido ? 5 : 15}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          enableArcLinkLabels={expandido || window.innerWidth > 640}
          tooltip={({ datum }) => (
            <div
              style={{
                background: 'white',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#111827',
                maxWidth: '200px',
                wordWrap: 'break-word'
              }}
            >
              <strong>{datum.data.label}</strong>: {datum.data.value}%
              {datum.data.valorOriginal !== undefined && (
                <div>
                  Total: R${' '}
                  {Number(datum.data.valorOriginal).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>
          )}
          legends={[
            {
              anchor: 'bottom',
              direction: expandido ? 'row' : 'column',
              justify: false,
              translateX: 0,
              translateY: expandido ? 60 : 40,
              itemsSpacing: expandido ? 12 : 8,
              itemWidth: expandido ? 90 : 120,
              itemHeight: 16,
              itemTextColor: '#111827',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 10,
              symbolShape: 'circle',
              // Filtrar os dados da legenda baseado no estado expandido
              data: expandido ? dadosFormatados : top3Dados,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000000',
                    itemBackground: '#f0f0f0',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <>
      {expandido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-2 sm:p-4">
          {cardContent}
        </div>
      )}

      {!expandido && (
        <div className="w-full">
          {cardContent}
        </div>
      )}
    </>
  );
}