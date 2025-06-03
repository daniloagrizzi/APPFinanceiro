import { useState } from 'react';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';
import { Target, Calendar, TrendingUp, CheckCircle, Edit2, X } from 'lucide-react';

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
    <div className="flex justify-between rounded-2xl items-center py-3 border-b last:border-b-0  hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"> 
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
          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
          aria-label="Editar"
          title="Editar"
        >
           <Edit2 className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          aria-label="Excluir"
          title="Excluir"
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

export default RendaCard;
