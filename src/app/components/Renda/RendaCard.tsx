import { useState } from 'react';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';

interface RendaCardProps {
  renda: RendaDto;
  onEdit?: (renda: RendaDto) => void;
  onDelete?: (id: number) => void;
}

const RendaCard = ({ renda, onEdit, onDelete }: RendaCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(renda);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete(renda.id);
      } catch (error) {
        console.error('Erro ao excluir renda:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  {renda.variavel && (
    <span className="text-sm text-yellow-600 font-medium">
      Renda Variável
    </span>
  )}
  

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-green-50 text-green-500 rounded-full mr-3">
          <span className="text-lg font-semibold">R$</span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{formatCurrency(renda.valor)}</p>
          <div className="flex space-x-3">
            <p className="text-sm text-gray-500">{renda.descricao}</p>
            <p className="text-xs text-gray-400">{formatDate(renda.data)}</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleEdit}
          disabled={isLoading}
          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          aria-label="Editar"
          title="Editar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
          aria-label="Excluir"
          title="Excluir"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default RendaCard;
