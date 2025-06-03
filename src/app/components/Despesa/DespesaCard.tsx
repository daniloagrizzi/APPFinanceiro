import { useState } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';
import { Edit2, X } from 'lucide-react';

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

  return (
    <div
      className={`flex justify-between rounded-2xl items-center py-3 border-b last:border-b-0 hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 ${
        despesa.ativo ? '' : 'opacity-60 grayscale'
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-full mr-3 flex-shrink-0">
          <span className="text-lg font-semibold">-</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{formatCurrency(despesa.valor)}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 truncate">{despesa.descricao}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400">{formatDate(despesa.data)}</span>
              {tiposDespesa.length > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {getTipoDespesaNome()}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full whitespace-nowrap ${getPrioridadeColor()}`}>
                {despesa.prioridade || 'Média'}
              </span>
              {!despesa.ativo && (
                <span className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Inativo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0 ml-2">
        <button
          onClick={handleEdit}
          disabled={isLoading}
          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
          aria-label="Editar despesa"
          title="Editar despesa"
        >
          <Edit2 className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
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