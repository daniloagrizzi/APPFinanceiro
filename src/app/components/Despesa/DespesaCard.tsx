import { useState } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';

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
    <div className="flex justify-between items-start py-4 px-3 bg-white shadow-sm rounded-xl border border-gray-100">
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default DespesaCard;