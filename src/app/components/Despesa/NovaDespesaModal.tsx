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
  const [tipoDespesaId, setTipoDespesaId] = useState<number>(0);
  const [recorrente, setRecorrente] = useState(false);
  const [frequenciaRecorrencia, setFrequenciaRecorrencia] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [ativo, setAtivo] = useState(true);

  // Função para limitar valor a 10 dígitos
  const handleValorChange = (inputValue: string) => {
    const numericValue = parseFloat(inputValue) || 0;
    if (numericValue <= 9999999999.99) {
      setValor(numericValue);
    }
  };

  useEffect(() => {
    if (despesaEdicao) {
      setDescricao(despesaEdicao.descricao);
      setValor(despesaEdicao.valor);
      setTipoDespesaId(despesaEdicao.tipoDespesaId);
      setRecorrente(despesaEdicao.recorrente);
      setFrequenciaRecorrencia(despesaEdicao.frequenciaRecorrencia || '');
      setPrioridade(despesaEdicao.prioridade || 'Média');
      setAtivo(despesaEdicao.ativo);
    } else {
      setDescricao('');
      setValor(0);
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
          <input
            type="number"
            step="0.01"
            min="0"
            max="9999999999.99"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={valor}
            onChange={(e) => handleValorChange(e.target.value)}
          />
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