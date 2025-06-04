'use client';

import { useState, useEffect } from 'react';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';
import { rendaService } from '@/services/rendaService';
import { authService } from '@/services/authService';

interface NovaRendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRendaAdicionada: (renda: RendaDto) => void;
  editingRenda: RendaDto | null;
}

export default function NovaRendaModal({
  isOpen,
  onClose,
  onRendaAdicionada,
  editingRenda,
}: NovaRendaModalProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number>(0);
  const [valorDisplay, setValorDisplay] = useState('');
  const [variavel, setVariavel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar valor como moeda
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValor(numericValue);
      setValorDisplay(processedValue);
    }
  };

  const handleValorBlur = () => {
    if (valor > 0) {
      setValorDisplay(formatarMoeda(valor));
    } else {
      setValorDisplay('');
    }
  };

  const handleValorFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (valor > 0) {
      const editableFormat = valor.toFixed(2).replace('.', ',');
      setValorDisplay(editableFormat);
    }
    e.target.select();
  };

  useEffect(() => {
    if (editingRenda) {
      setDescricao(editingRenda.descricao);
      setValor(editingRenda.valor);
      setValorDisplay(formatarMoeda(editingRenda.valor));
      setVariavel(editingRenda.variavel); 
    } else {
      setDescricao('');
      setValor(0);
      setValorDisplay('');
      setVariavel(false); 
    }
  }, [editingRenda]);

  const handleSubmit = async () => {
    if (!descricao.trim() || valor <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setIsLoading(true);

    try {
      const userInfo = await authService.getUserInfo();
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];

      const rendaParaSalvar: RendaDto = {
        id: editingRenda ? editingRenda.id : 0,
        descricao,
        valor,
        data: editingRenda ? editingRenda.data : dataFormatada,
        usuarioId: userInfo.id || userInfo.Id,
        variavel,
      };

      let rendaSalva: RendaDto;

      if (editingRenda) {
        rendaSalva = await rendaService.atualizarRenda(rendaParaSalvar);
      } else {
        rendaSalva = await rendaService.adicionarRenda(rendaParaSalvar);
      }

      onRendaAdicionada(rendaSalva);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar renda:", error);
      alert('Erro ao salvar renda.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {editingRenda ? 'Editar Renda' : 'Adicionar Renda'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor</label>
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
              disabled={isLoading}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Valor máximo: R$ 9.999.999.999,99
          </div>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={variavel}
              onChange={(e) => setVariavel(e.target.checked)}
              className="form-checkbox"
              disabled={isLoading}
            />
            <span>Renda Variável</span>
          </label>
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