'use client';

import { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RelatorioMensalDto } from '@/services/dashboardService';

interface Props {
  data: RelatorioMensalDto[];
}

const cores = {
  receita: '#0AD611',
  despesa: '#EF0707',
  saldo: '#221DAF'
};

export default function GraficoEvolucaoMensal({ data }: Props) {
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
      <div className="bg-gray-100 rounded-2xl shadow p-6 w-1 h-[60vh] flex items-center justify-center">
        <p className="text-gray-900 text-center text-base">Nenhum dado disponível para o gráfico.</p>
      </div>
    );
  }

  // Ordenar dados por ano e mês
  const dadosOrdenados = [...data].sort((a, b) => {
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.mes - b.mes;
  });

  const dadosFormatados = dadosOrdenados.map((item) => {
    const mesNome = new Date(item.ano, item.mes - 1).toLocaleDateString('pt-BR', { 
      month: 'short',
      year: '2-digit'
    });

    return {
      mes: mesNome,
      Receitas: item.totalRenda,
      Despesas: Math.abs(item.totalDespesas), // Valor absoluto para melhor visualização
      Saldo: item.saldo,
      ano: item.ano,
      mesNumero: item.mes
    };
  });

  // Calcular tendência do saldo
  const calcularTendencia = () => {
    if (dadosFormatados.length < 2) return null;
    
    const ultimoSaldo = dadosFormatados[dadosFormatados.length - 1].Saldo;
    const penultimoSaldo = dadosFormatados[dadosFormatados.length - 2].Saldo;
    const diferenca = ultimoSaldo - penultimoSaldo;
    
    return {
      valor: diferenca,
      porcentagem: penultimoSaldo !== 0 ? (diferenca / Math.abs(penultimoSaldo)) * 100 : 0,
      tipo: diferenca > 0 ? 'positiva' : diferenca < 0 ? 'negativa' : 'neutra'
    };
  };

  const tendencia = calcularTendencia();

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg p-6 w-full max-w-6xl ${expandido ? 'h-[90vh]' : 'h-[80vh]'} flex flex-col justify-between relative`}
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Evolução Financeira Mensal
        </h2>
        
        {tendencia && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">Tendência:</span>
            <span className={`font-medium flex items-center gap-1 ${
              tendencia.tipo === 'positiva' ? 'text-green-600' : 
              tendencia.tipo === 'negativa' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {tendencia.tipo === 'positiva' ? '↗' : tendencia.tipo === 'negativa' ? '↘' : '→'}
              {tendencia.porcentagem.toFixed(1)}%
              <span className="text-gray-500 ml-1">
                (R$ {Math.abs(tendencia.valor).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })})
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dadosFormatados}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="mes"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#374151' }}
              tickFormatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                
                const data = payload[0].payload;
                
                return (
                  <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                    <div className="font-semibold mb-2 text-gray-800">{label}</div>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium text-gray-700">{entry.dataKey}:</span>
                        <span className="text-gray-800">
                          R$ {Number(entry.value).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                      <div>Período: {data.mesNumero}/{data.ano}</div>
                      <div>Saldo Total: R$ {Number(data.Saldo).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}</div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingBottom: '20px',
                fontSize: '14px'
              }}
            />
            <Bar 
              dataKey="Receitas" 
              fill={cores.receita} 
              name="Receitas"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="Despesas" 
              fill={cores.despesa} 
              name="Despesas"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="Saldo" 
              fill={cores.saldo} 
              name="Saldo"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo estatístico */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-gray-600">Média Receitas</div>
            <div className="font-semibold text-green-600">
              R$ {(dadosFormatados.reduce((acc, item) => acc + item.Receitas, 0) / dadosFormatados.length).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Média Despesas</div>
            <div className="font-semibold text-red-600">
              R$ {(dadosFormatados.reduce((acc, item) => acc + item.Despesas, 0) / dadosFormatados.length).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Saldo Atual</div>
            <div className={`font-semibold ${
              dadosFormatados[dadosFormatados.length - 1]?.Saldo >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              R$ {dadosFormatados[dadosFormatados.length - 1]?.Saldo.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>
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
        <div className="w-1/1">
          {cardContent}
        </div>
      )}
    </>
  );
}