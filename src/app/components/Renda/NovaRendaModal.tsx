import { useState } from 'react';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';
import { rendaService } from '@/services/rendaService';
import { authService } from '@/services/authService';

interface NovaRendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRendaAdicionada: (novaRenda: RendaDto) => void;
   onSaved: () => void; 
   editingRenda: RendaDto | null;
}

export default function NovaRendaModal({ isOpen, onClose, onRendaAdicionada }: NovaRendaModalProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);

  const handleSubmit = async () => {
    try {
      const userInfo = await authService.getUserInfo();
const hoje = new Date();
const dataFormatada = hoje.toISOString().split('T')[0]; 
      const novaRenda: RendaDto = {
        id: 0,
        descricao,
        valor,
        data: dataFormatada,
        usuarioId: userInfo.id || userInfo.Id, 
      };

      const rendaSalva = await rendaService.adicionarRenda(novaRenda);
      onRendaAdicionada(rendaSalva);
      onClose();
    } catch (error) {
      alert('Erro ao adicionar renda.');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Adicionar Renda</h2>

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
            onChange={(e) => setValor(parseFloat(e.target.value))}
          />
        </div>

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
