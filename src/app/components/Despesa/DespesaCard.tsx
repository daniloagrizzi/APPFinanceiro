import { useState } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';
import { X } from 'lucide-react';

interface DespesaCardProps {
  despesa: DespesaDto;
  onEdit?: (despesa: DespesaDto) => void;
  onDelete?: (id: number) => Promise<void> | void;
  tiposDespesa?: { id: number; descricao: string }[];
}

const DespesaCard = ({ despesa, onEdit, onDelete, tiposDespesa = [] }: DespesaCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (onEdit) onEdit(despesa);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(despesa.id);
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTipoDespesaNome = () => {
    const tipo = tiposDespesa.find(t => t.id === despesa.tipoDespesaId);
    return tipo ? tipo.descricao : 'Geral';
  };

  const getPrioridadeColor = () => {
    switch (despesa.prioridade) {
      case 'Alta':
        return 'bg-red-100 text-red-700';
      case 'Média':
        return 'bg-yellow-100 text-yellow-700';
      case 'Baixa':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAtivoColor = () => {
    return despesa.ativo
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-300 text-gray-700';
  };

  return (
    <div
      className={`flex justify-between rounded-2xl items-center py-3 border-b last:border-b-0 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${
        despesa.ativo ? '' : 'opacity-60 grayscale'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold text-lg">
          -
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">{formatCurrency(despesa.valor)}</p>
          <p className="text-sm text-gray-600">{despesa.descricao}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{formatDate(despesa.data)}</span>
            {tiposDespesa.length > 0 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {getTipoDespesaNome()}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full ${getPrioridadeColor()}`}>
              {despesa.prioridade || 'Média'}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${getAtivoColor()}`}>
              {despesa.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 mt-1">
        <button
          onClick={handleEdit}
          disabled={isLoading}
          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          aria-label="Editar despesa"
          title="Editar despesa"
        >
          <svg className="w-4 h-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          aria-label="Excluir despesa"
          title="Excluir despesa"
        >
          {isLoading ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <X className="w-4 h-4 cursor-pointer" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DespesaCard;
