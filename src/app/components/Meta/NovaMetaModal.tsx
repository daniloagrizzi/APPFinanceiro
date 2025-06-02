'use client';

import { useState, useEffect } from 'react';
import { MetaDto } from '@/Interfaces/Meta/MetaDto';
import { metaService } from '@/services/metaService';
import { authService } from '@/services/authService';

interface NovaMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetaAdicionada: (meta: MetaDto) => void;
  metaEdicao: MetaDto | null;
}

export default function NovaMetaModal({
  isOpen,
  onClose,
  onMetaAdicionada,
  metaEdicao,
}: NovaMetaModalProps) {
  const [nome, setNome] = useState('');
  const [valorMeta, setValorMeta] = useState<number>(0);
  const [progresso, setProgresso] = useState<number>(0);
  const [dataReferencia, setDataReferencia] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');

  // Função para limitar valores a 10 dígitos
  const handleValorMetaChange = (inputValue: string) => {
    const numericValue = parseFloat(inputValue) || 0;
    if (numericValue <= 9999999999.99) {
      setValorMeta(numericValue);
    }
  };

  const handleProgressoChange = (inputValue: string) => {
    const numericValue = parseFloat(inputValue) || 0;
    if (numericValue <= 9999999999.99) {
      setProgresso(numericValue);
    }
  };

  useEffect(() => {
    if (metaEdicao) {
      setNome(metaEdicao.nome);
      setValorMeta(metaEdicao.valorMeta);
      setProgresso(metaEdicao.progresso);
      
      const formatDateForInput = (date: string | Date) => {
        if (typeof date === 'string') {
          return date.split('T')[0];
        }
        return date.toISOString().split('T')[0];
      };
      
      setDataReferencia(formatDateForInput(metaEdicao.dataReferencia));
      setDataConclusao(formatDateForInput(metaEdicao.dataConclusao));
    } else {
      setNome('');
      setValorMeta(0);
      setProgresso(0);
      setDataReferencia('');
      setDataConclusao('');
    }
  }, [metaEdicao]);

  const handleSubmit = async () => {
    if (
      !nome ||
      valorMeta <= 0 ||
      !dataReferencia.trim()
    ) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (progresso > valorMeta) {
      alert('O progresso não pode ser maior que o valor da meta.');
      return;
    }

    if (!metaEdicao) {
      const hoje = new Date();
      const dataRef = new Date(dataReferencia);
    }

    try {
      const userInfo = await authService.getUserInfo();

      const metaParaSalvar: MetaDto = {
        id: metaEdicao ? metaEdicao.id : 0,
        nome,
        valorMeta,
        progresso,
        dataReferencia,
        dataConclusao: dataConclusao || dataReferencia, 
        usuarioId: userInfo.id || userInfo.Id,
      };

      const metaSalva = metaEdicao
        ? await metaService.atualizarMeta(metaParaSalvar)
        : await metaService.adicionarMeta(metaParaSalvar);

      onMetaAdicionada(metaSalva);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      alert('Erro ao salvar meta.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {metaEdicao ? 'Editar Meta' : 'Adicionar Meta'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome da Meta *</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Reserva de emergência, Viagem, Carro novo..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor da Meta *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="9999999999.99"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={valorMeta}
            onChange={(e) => handleValorMetaChange(e.target.value)}
          />
          <div className="mt-1 text-xs text-gray-500">
            Valor máximo: R$ 9.999.999.999,99
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Progresso Atual</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="9999999999.99"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={progresso}
            onChange={(e) => handleProgressoChange(e.target.value)}
          />
          {valorMeta > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              Progresso: {((progresso / valorMeta) * 100).toFixed(1)}%
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500">
            Valor máximo: R$ 9.999.999.999,99
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Data de Referência *</label>
          <input
            type="date"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={dataReferencia}
            onChange={(e) => setDataReferencia(e.target.value)}
          />
          <div className="mt-1 text-xs text-gray-500">
            Data limite para atingir a meta
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Data de Conclusão Prevista</label>
          <input
            type="date"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={dataConclusao}
            onChange={(e) => setDataConclusao(e.target.value)}
          />
          <div className="mt-1 text-xs text-gray-500">
            Quando você planeja concluir a meta (opcional)
          </div>
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