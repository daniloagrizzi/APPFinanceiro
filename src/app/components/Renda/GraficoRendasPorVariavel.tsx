'use client';

import { useState, useRef, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

interface Props {
  data: any[];
}

const cores = ['#70e000', '#004d00'];

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

  // Debug: log dos dados recebidos
  console.log('[GraficoRendasPorVariavel] Dados recebidos:', data);
  console.log('[GraficoRendasPorVariavel] Tipo dos dados:', typeof data);
  console.log('[GraficoRendasPorVariavel] É array?', Array.isArray(data));

  // Verificação mais robusta dos dados
  const temDadosValidos = data && 
    Array.isArray(data) && 
    data.length > 0 && 
    data.some(item => item && typeof item === 'object');

  if (!temDadosValidos) {
    console.log('[GraficoRendasPorVariavel] Dados inválidos ou vazios');
    return (
      <div className="bg-white rounded-2xl shadow p-6 w-full h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-base mb-2">Nenhum dado disponível para o gráfico.</p>
          <p className="text-gray-500 text-sm">
            {!data ? 'Dados não carregados' : 
             !Array.isArray(data) ? 'Formato de dados inválido' :
             data.length === 0 ? 'Nenhuma renda cadastrada' :
             'Dados sem estrutura válida'}
          </p>
        </div>
      </div>
    );
  }

  const dadosFormatados = data.map((item, index) => {
    console.log(`[GraficoRendasPorVariavel] Processando item ${index}:`, item);
    
    // Lógica mais robusta para extrair a variável
    let variavel = 'Desconhecido';
    if (item.variavel !== undefined) {
      variavel = typeof item.variavel === 'boolean' 
        ? (item.variavel ? "Variável" : "Fixa") 
        : String(item.variavel);
    } else if (item.Variavel !== undefined) {
      variavel = typeof item.Variavel === 'boolean' 
        ? (item.Variavel ? "Variável" : "Fixa") 
        : String(item.Variavel);
    }

    // Lógica mais robusta para extrair a porcentagem
    let porcentagem = 0;
    if (typeof item.Porcentagem === 'number') {
      porcentagem = item.Porcentagem;
    } else if (typeof item.porcentagem === 'number') {
      porcentagem = item.porcentagem;
    } else if (typeof item.percentage === 'number') {
      porcentagem = item.percentage;
    } else if (typeof item.value === 'number') {
      porcentagem = item.value;
    }

    // Lógica para extrair valor total
    const valorTotal = item.ValorTotal || item.valorTotal || item.valor || item.total || 0;

    const dadoFormatado = {
      id: variavel,
      label: variavel,
      value: parseFloat(porcentagem.toFixed(1)),
      valorOriginal: valorTotal,
      tooltipValue: `${variavel}: ${porcentagem.toFixed(1)}%`,
      color: cores[index % cores.length],
    };

    console.log(`[GraficoRendasPorVariavel] Dado formatado ${index}:`, dadoFormatado);
    return dadoFormatado;
  });

  // Verificar se temos dados formatados válidos
  const dadosValidos = dadosFormatados.filter(item => 
    item.value !== undefined && 
    item.value !== null && 
    !isNaN(item.value) && 
    item.value >= 0
  );

  if (dadosValidos.length === 0) {
    console.log('[GraficoRendasPorVariavel] Nenhum dado válido após formatação');
    return (
      <div className="bg-white rounded-2xl shadow p-6 w-full h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-base mb-2">Dados inválidos para o gráfico.</p>
          <p className="text-gray-500 text-sm">Os dados não possuem valores numéricos válidos.</p>
        </div>
      </div>
    );
  }

  console.log('[GraficoRendasPorVariavel] Dados válidos para renderizar:', dadosValidos);

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg p-6 w-full ${expandido ? 'h-[70vh] w-full max-w-4xl' : 'h-[70vh]'} flex flex-col justify-between relative`}
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
        Distribuição por tipo de renda
      </h2>

      <div className="flex-grow relative">
        <ResponsivePie
          data={dadosValidos}
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
              {datum.data.valorOriginal !== undefined && datum.data.valorOriginal > 0 && (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
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