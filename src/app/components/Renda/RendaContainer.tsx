import { useState, useEffect } from 'react';
import RendaCard from './RendaCard';
import { rendaService } from '@/services/rendaService';
import { RendaDto } from '@/Interfaces/Renda/RendaDto';

interface RendasContainerProps {
  onAdd?: () => void;
  onEdit?: (renda: RendaDto) => void;
}

const RendasContainer = ({ onAdd, onEdit }: RendasContainerProps) => {
  const [rendas, setRendas] = useState<RendaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRendas();
  }, []);

  const fetchRendas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await rendaService.listarPorUsuario();
      setRendas(data);
    } catch (err) {
      console.error('Erro ao carregar rendas:', err);
      setError('Não foi possível carregar suas rendas. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (renda: RendaDto) => {
    if (onEdit) {
      onEdit(renda);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await rendaService.deletarRenda(id);
      // Atualiza a lista após exclusão bem-sucedida
      setRendas(rendas.filter(renda => renda.id !== id));
    } catch (err) {
      console.error('Erro ao excluir renda:', err);
      throw err; // Propaga o erro para tratamento no componente RendaCard
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Rendas</h2>
        <button 
          onClick={onAdd}
          className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          aria-label="Adicionar nova renda"
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
            onClick={fetchRendas}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : rendas.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Você ainda não tem rendas cadastradas.</p>
          <button 
            onClick={onAdd}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Adicionar primeira renda
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {rendas.map(renda => (
            <RendaCard 
              key={renda.id} 
              renda={renda} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RendasContainer;