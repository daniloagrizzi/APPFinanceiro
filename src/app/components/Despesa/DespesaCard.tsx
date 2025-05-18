import { useState } from 'react';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';

interface DespesaCardProps {
  despesa: DespesaDto;
  onEdit?: (despesa: DespesaDto) => void;
  onDelete?: (id: number) => Promise<void> | void;
  tiposDespesa?: { id: number; nome: string }[];
}

const DespesaCard = ({ despesa, onEdit, onDelete, tiposDespesa = [] }: DespesaCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(despesa);
    }
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
    return tipo ? tipo.nome : 'Geral';
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-full mr-3">
          <span className="text-lg font-semibold">-</span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{formatCurrency(despesa.valor)}</p>
          <div className="flex space-x-3">
            <p className="text-sm text-gray-500">{despesa.descricao}</p>
            <p className="text-xs text-gray-400">{formatDate(despesa.data)}</p>
            {tiposDespesa.length > 0 && (
              <p className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {getTipoDespesaNome()}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
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