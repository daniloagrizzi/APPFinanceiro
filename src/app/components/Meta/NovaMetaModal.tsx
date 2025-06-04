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
  const [valorMetaDisplay, setValorMetaDisplay] = useState('');
  const [progresso, setProgresso] = useState<number>(0);
  const [progressoDisplay, setProgressoDisplay] = useState('');
  const [dataReferencia, setDataReferencia] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  const createValueHandler = (setValue: (val: number) => void, setDisplay: (val: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      const cleanValue = inputValue.replace(/[^\d,]/g, '');
      
      const parts = cleanValue.split(',');
      let processedValue = parts[0];
      
      if (parts.length > 1) {
        const decimals = parts[1].substring(0, 2);
        processedValue = processedValue + ',' + decimals;
      }
      
      const numericValue = parseFloat(processedValue.replace(',', '.')) || 0;
      
      if (numericValue <= 9999999999.99) {
        setValue(numericValue);
        setDisplay(processedValue);
      }
    };
  };

  const createBlurHandler = (value: number, setDisplay: (val: string) => void) => {
    return () => {
      if (value > 0) {
        setDisplay(formatarMoeda(value));
      } else {
        setDisplay('');
      }
    };
  };

  const createFocusHandler = (value: number, setDisplay: (val: string) => void) => {
    return (e: React.FocusEvent<HTMLInputElement>) => {
      if (value > 0) {
        const editableFormat = value.toFixed(2).replace('.', ',');
        setDisplay(editableFormat);
      }
      e.target.select();
    };
  };

  const handleValorMetaChange = createValueHandler(setValorMeta, setValorMetaDisplay);
  const handleValorMetaBlur = createBlurHandler(valorMeta, setValorMetaDisplay);
  const handleValorMetaFocus = createFocusHandler(valorMeta, setValorMetaDisplay);

  const handleProgressoChange = createValueHandler(setProgresso, setProgressoDisplay);
  const handleProgressoBlur = createBlurHandler(progresso, setProgressoDisplay);
  const handleProgressoFocus = createFocusHandler(progresso, setProgressoDisplay);

  useEffect(() => {
    if (metaEdicao) {
      setNome(metaEdicao.nome);
      setValorMeta(metaEdicao.valorMeta);
      setValorMetaDisplay(formatarMoeda(metaEdicao.valorMeta));
      setProgresso(metaEdicao.progresso);
      setProgressoDisplay(formatarMoeda(metaEdicao.progresso));
      
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
      setValorMetaDisplay('');
      setProgresso(0);
      setProgressoDisplay('');
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

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor da Meta *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              R$
            </span>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 pl-10 text-gray-900"
              value={valorMetaDisplay}
              onChange={handleValorMetaChange}
              onBlur={handleValorMetaBlur}
              onFocus={handleValorMetaFocus}
              placeholder="0,00"
              disabled={isLoading}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Valor máximo: R$ 9.999.999.999,99
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Progresso Atual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              R$
            </span>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 pl-10 text-gray-900"
              value={progressoDisplay}
              onChange={handleProgressoChange}
              onBlur={handleProgressoBlur}
              onFocus={handleProgressoFocus}
              placeholder="0,00"
              disabled={isLoading}
            />
          </div>
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <div className="mt-1 text-xs text-gray-500">
            Quando você planeja concluir a meta (opcional)
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              isLoading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}