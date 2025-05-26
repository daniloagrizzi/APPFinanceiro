'use client';

import { useState, useRef, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { RendasComPorcentagemDto } from '@/services/dashboardService';

interface Props {
  data: any[];
}

const cores = ['#70e000',  '#004d00',];

export default function GraficoRendasPorVariavel({ data }: Props) {
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
      <div className="bg-white rounded-2xl shadow p-6 w-full h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-center text-base">Nenhum dado disponível para o gráfico.</p>
      </div>
    );
  }

  const dadosFormatados = data.map((item, index) => {
    const variavel = item.variavel !== undefined 
      ? (typeof item.variavel === 'boolean' 
         ? (item.variavel ? "Variável" : "Fixa") 
         : item.variavel) 
      : item.Variavel || `Variável ${index + 1}`;
    
    const porcentagem = typeof item.Porcentagem === 'number' ? item.Porcentagem
                        : typeof item.porcentagem === 'number' ? item.porcentagem
                        : 1;
    const valorTotal = item.ValorTotal || item.valorTotal || 0;

    return {
      id: variavel,
      label: variavel,
      value: parseFloat(porcentagem.toFixed(1)),
      valorOriginal: valorTotal,
      tooltipValue: `${variavel}: ${porcentagem.toFixed(1)}%`,
      color: cores[index % cores.length],
    };
  });

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg p-6 w-full ${expandido ? 'h-[70vh] w-full max-w-4xl' : 'h-[70vh] ' } flex flex-col justify-between relative`}
    >
      <button
        onClick={() => setExpandido(!expandido)}
        className="absolute top-4 right-4 p-1 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <img
          src={expandido ? '/Icons/close.png' : '/Icons/open_in_full.png'}
          alt={expandido ? 'Fechar' : 'Expandir'}
          className="w-6 h-6 filter brightness-0 saturate-100"
        />
      </button>

      <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
        Distribuição por renda
      </h2>

      <div className="flex-grow relative">
        <ResponsivePie
          data={dadosFormatados}
          margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
          innerRadius={0.55}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#1f2937"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          tooltip={({ datum }) => (
            <div
              style={{
                background: 'white',
                padding: '10px 14px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#111827',
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
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 40,
              itemsSpacing: 12,
              itemWidth: 90,
              itemHeight: 20,
              itemTextColor: '#111827',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: 'circle',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 ">
      {cardContent}
    </div>
)}

      {!expandido && (
        <div className="w-1/4 fixed">
          {cardContent}
        </div>
      )}
    </>
  );
}