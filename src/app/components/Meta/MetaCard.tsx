import { useState } from 'react';
import { MetaDto } from '@/Interfaces/Meta/MetaDto';
import { Target, Calendar, TrendingUp, CheckCircle, Edit2, X } from 'lucide-react';

interface MetaCardProps {
  meta: MetaDto;
  onEdit?: (meta: MetaDto) => void;
  onDelete?: (id: number) => void;
}

const MetaCard = ({ meta, onEdit, onDelete }: MetaCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const progressoPercentual = Math.min((meta.progresso / meta.valorMeta) * 100, 100);
  const valorRestante = Math.max(meta.valorMeta - meta.progresso, 0);
  const isCompleta = meta.progresso >= meta.valorMeta;
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string | Date) => {
    try {
      if (typeof data === 'string') {
        const [datePart] = data.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
      }
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return typeof data === 'string' ? data : data.toString();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(meta);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete(meta.id);
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32  from-blue-50 to-green-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      
      {/* Header do card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isCompleta ? 'bg-green-100' : 'bg-blue-100'}`}>
            {isCompleta ? (
              <CheckCircle className={`w-6 h-6 ${isCompleta ? 'text-green-600' : 'text-blue-600'}`} />
            ) : (
              <Target className={`w-6 h-6 ${isCompleta ? 'text-green-600' : 'text-blue-600'}`} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{meta.nome}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Meta: {formatarData(meta.dataReferencia)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isCompleta && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mr-2">
              Concluída
            </div>
          )}
          
          {/* Botões de ação */}
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="w-8 h-8 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
            aria-label="Editar"
            title="Editar"
          >
            <Edit2 className="w-4 h-4 cursor-pointer" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="z-10 w-8 h-8 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
            aria-label="Excluir meta"
            title="Excluir meta"
          >
            <X className="w-4 h-4 cursor-pointer"/>
          </button>
        </div>
      </div>

      {/* Valores principais */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-gray-800">
            {formatarMoeda(meta.progresso)}
          </span>
          <span className="text-lg text-gray-500">
            de {formatarMoeda(meta.valorMeta)}
          </span>
        </div>
        
        {!isCompleta && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Restam {formatarMoeda(valorRestante)}</span>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span className="font-medium">{progressoPercentual.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              isCompleta 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : 'bg-gradient-to-r from-blue-400 to-green-400'
            }`}
            style={{ width: `${progressoPercentual}%` }}
          ></div>
        </div>
      </div>

      {/* Footer com data de conclusão */}
      {meta.dataConclusao && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {isCompleta ? 'Concluída em:' : 'Previsão:'}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {formatarData(meta.dataConclusao)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetaCard;