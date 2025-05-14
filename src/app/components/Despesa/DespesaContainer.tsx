import { useState, useEffect } from 'react';
import DespesaCard from './DespesaCard';
import { despesaService } from '@/services/despesaService';
import { DespesaDto } from '@/Interfaces/Despesa/DespesaDto';

interface DespesasContainerProps {
  onAdd?: () => void;
  onEdit?: (despesa: DespesaDto) => void;
  onDespesaAtualizadaExternamente?: (callback: (despesa: DespesaDto) => void) => void;
  tiposDespesa?: { id: number; nome: string }[];
}

const DespesasContainer = ({ 
  onAdd, 
  onEdit, 
  onDespesaAtualizadaExternamente,
  tiposDespesa = []
}: DespesasContainerProps) => {
  const [despesas, setDespesas] = useState<DespesaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDespesas();

    if (onDespesaAtualizadaExternamente) {
      onDespesaAtualizadaExternamente(handleDespesaEditada);
    }
  }, []);

  const fetchDespesas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await despesaService.listarPorUsuario();
      setDespesas(data);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
      setError('Não foi possível carregar suas despesas. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (despesa: DespesaDto) => {
    if (onEdit) {
      onEdit(despesa); 
    }
  };

  const handleDespesaEditada = (despesaAtualizada: DespesaDto) => {
    setDespesas(prev =>
      prev.map(d => (d.id === despesaAtualizada.id ? despesaAtualizada : d))
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await despesaService.deletarDespesa(id);
      setDespesas(despesas.filter(despesa => despesa.id !== id));
    } catch (err) {
      console.error('Erro ao excluir despesa:', err);
      throw err; 
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Despesas</h2>
        <button 
          onClick={onAdd}
          className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          aria-label="Adicionar nova despesa"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchDespesas}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : despesas.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Você ainda não tem despesas cadastradas.</p>
          <button 
            onClick={onAdd}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Adicionar primeira despesa
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {despesas.map(despesa => (
            <DespesaCard 
              key={despesa.id} 
              despesa={despesa} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              tiposDespesa={tiposDespesa}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DespesasContainer;