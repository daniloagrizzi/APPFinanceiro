import { useState, useEffect } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';
import { despesaService } from '@/services/despesaService';
import { authService } from '@/services/authService';
import { tipoDespesaService } from '@/services/tipoDespesaService';

interface NovaDespesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDespesaAdicionada: (novaDespesa: DespesaDto) => void;
  onSaved: () => void;
  editingDespesa: DespesaDto | null;  // Corrigido: editingDespesa ao invés de editingRenda
}

export default function NovaDespesaModal({
  isOpen,
  onClose,
  onDespesaAdicionada,
  onSaved,
  editingDespesa,
}: NovaDespesaModalProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [tipoDespesaId, setTipoDespesaId] = useState<number>(0);
  const [tiposDespesa, setTiposDespesa] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const carregarTiposDespesa = async () => {
        try {
          const tipos = await tipoDespesaService.listarTipoDespesas();
          setTiposDespesa(tipos);
          if (tipos.length > 0) {
            setTipoDespesaId(tipos[0].id);
          }
        } catch (error) {
          console.error('Erro ao carregar tipos de despesa:', error);
        }
      };
      carregarTiposDespesa();
    }
  }, [isOpen]);

  // Preenche os campos ao abrir o modal em modo edição
  useEffect(() => {
    if (isOpen && editingDespesa) {
      setDescricao(editingDespesa.descricao);
      setValor(editingDespesa.valor);
      setTipoDespesaId(editingDespesa.tipoDespesaId);
    } else if (isOpen) {
      // Se for adicionar nova despesa, limpa os campos
      setDescricao('');
      setValor(0);
      if (tiposDespesa.length > 0) {
        setTipoDespesaId(tiposDespesa[0].id);
      }
    }
  }, [isOpen, editingDespesa, tiposDespesa]);

  const handleSubmit = async () => {
    try {
      const userInfo = await authService.getUserInfo();
      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0];

      const despesaParaSalvar: DespesaDto = {
        id: editingDespesa ? editingDespesa.id : 0,  // mantém id se for edição
        descricao,
        valor,
        data: dataFormatada,
        tipoDespesaId,
        usuarioId: userInfo.id ?? userInfo.Id,
      };

      let despesaSalva: DespesaDto;
      if (editingDespesa) {
        // Atualiza despesa
        despesaSalva = await despesaService.atualizarDespesa(despesaParaSalvar);
      } else {
        // Adiciona nova despesa
        despesaSalva = await despesaService.adicionarDespesa(despesaParaSalvar);
      }

      onDespesaAdicionada(despesaSalva);
      onSaved();
      onClose();
    } catch (error) {
      alert('Erro ao salvar despesa.');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{editingDespesa ? 'Editar Despesa' : 'Adicionar Despesa'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Valor</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
          />
        </div>

        {tiposDespesa.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Despesa</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={tipoDespesaId}
              onChange={(e) => setTipoDespesaId(parseInt(e.target.value))}
            >
              {tiposDespesa.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
