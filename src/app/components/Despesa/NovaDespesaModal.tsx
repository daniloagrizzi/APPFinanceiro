'use client';

import { useState, useEffect } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';
import { TipoDespesaDto } from '@/Interfaces/TipoDespesa/TipoDespesaDto';
import { despesaService } from '@/services/despesaService';
import { tipoDespesaService } from '@/services/tipoDespesaService';
import { authService } from '@/services/authService';

interface NovaDespesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDespesaAdicionada: (despesa: DespesaDto) => void;
  despesaEdicao: DespesaDto | null;  
  tiposDespesa: TipoDespesaDto[];    
}

export default function NovaDespesaModal({
  isOpen,
  onClose,
  onDespesaAdicionada,
  despesaEdicao,
  tiposDespesa,
}: NovaDespesaModalProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number>(0);
  const [valorDisplay, setValorDisplay] = useState('');
  const [tipoDespesaId, setTipoDespesaId] = useState<number>(0);
  const [recorrente, setRecorrente] = useState(false);
  const [frequenciaRecorrencia, setFrequenciaRecorrencia] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [ativo, setAtivo] = useState(true);

  // Função para formatar valor como moeda
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  // Função simplificada para lidar com mudanças no input de valor
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números, vírgula e ponto
    const cleanValue = inputValue.replace(/[^\d,]/g, '');
    
    // Processa vírgulas (máximo 1) e casas decimais (máximo 2)
    const parts = cleanValue.split(',');
    let processedValue = parts[0];
    
    if (parts.length > 1) {
      const decimals = parts[1].substring(0, 2);
      processedValue = processedValue + ',' + decimals;
    }
    
    // Converte para número
    const numericValue = parseFloat(processedValue.replace(',', '.')) || 0;
    
    // Verifica limite
    if (numericValue <= 9999999999.99) {
      setValor(numericValue);
      setValorDisplay(processedValue);
    }
  };

  // Função para quando o campo perde o foco - aplica formatação completa
  const handleValorBlur = () => {
    if (valor > 0) {
      setValorDisplay(formatarMoeda(valor));
    } else {
      setValorDisplay('');
    }
  };

  // Função para quando o campo ganha o foco - formato editável
  const handleValorFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (valor > 0) {
      const editableFormat = valor.toFixed(2).replace('.', ',');
      setValorDisplay(editableFormat);
    }
    e.target.select();
  };

  useEffect(() => {
    if (despesaEdicao) {
      setDescricao(despesaEdicao.descricao);
      setValor(despesaEdicao.valor);
      setValorDisplay(formatarMoeda(despesaEdicao.valor));
      setTipoDespesaId(despesaEdicao.tipoDespesaId);
      setRecorrente(despesaEdicao.recorrente);
      setFrequenciaRecorrencia(despesaEdicao.frequenciaRecorrencia || '');
      setPrioridade(despesaEdicao.prioridade || 'Média');
      setAtivo(despesaEdicao.ativo);
    } else {
      setDescricao('');
      setValor(0);
      setValorDisplay('');
      setTipoDespesaId(0);
      setRecorrente(false);
      setFrequenciaRecorrencia('');
      setPrioridade('Média');
      setAtivo(true);
    }
  }, [despesaEdicao]);

  const handleSubmit = async () => {
    if (
        !descricao.trim() ||
        valor <= 0 ||
        tipoDespesaId === 0 ||
        (recorrente && !frequenciaRecorrencia.trim()) ||
        !prioridade.trim()
      ) {
        alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        return;
      }
      
    try {
      const userInfo = await authService.getUserInfo();
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];

      const despesaParaSalvar: DespesaDto = {
        id: despesaEdicao ? despesaEdicao.id : 0,
        descricao,
        valor,
        data: despesaEdicao ? despesaEdicao.data : dataFormatada,
        tipoDespesaId,
        usuarioId: userInfo.id || userInfo.Id,
        recorrente,
        frequenciaRecorrencia: recorrente ? frequenciaRecorrencia : '',
        prioridade,
        ativo,
      };

      const despesaSalva = despesaEdicao
        ? await despesaService.atualizarDespesa(despesaParaSalvar)
        : await despesaService.adicionarDespesa(despesaParaSalvar);

      onDespesaAdicionada(despesaSalva);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      alert('Erro ao salvar despesa.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {despesaEdicao ? 'Editar Despesa' : 'Adicionar Despesa'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descrição *</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              R$
            </span>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 pl-10 text-gray-900"
              value={valorDisplay}
              onChange={handleValorChange}
              onBlur={handleValorBlur}
              onFocus={handleValorFocus}
              placeholder="0,00"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Valor máximo: R$ 9.999.999.999,99
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tipo de Despesa *</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={tipoDespesaId}
            onChange={(e) => setTipoDespesaId(Number(e.target.value))}
          >
            <option value={0} disabled>Selecione um tipo</option>
            {tiposDespesa.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prioridade *</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="recorrente"
            checked={recorrente}
            onChange={(e) => setRecorrente(e.target.checked)}
          />
          <label htmlFor="recorrente" className="text-sm text-gray-700">
            Despesa recorrente
          </label>
        </div>

        {recorrente && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Frequência da Recorrência
            </label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
              value={frequenciaRecorrencia}
              onChange={(e) => setFrequenciaRecorrencia(e.target.value)}
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensal">Mensal</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="ativo"
            checked={ativo} 
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <label htmlFor="ativo" className="text-sm text-gray-700">
            Despesa ativa?
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}