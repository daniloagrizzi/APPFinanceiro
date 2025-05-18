'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { authService } from "@/services/authService";
import { despesaService } from "@/services/despesaService"; 
import { tipoDespesaService } from "@/services/tipoDespesaService"; 
import SidePannel from "../components/SidePannel/SidePannel";
import DespesaCard from "../components/Despesa/DespesaCard";
import { DespesaDto } from "@/Interfaces/Despesa/DespesaDto";

export default function Despesas() {
  const [isAuth, setIsAuth] = useState(false);
  const [despesas, setDespesas] = useState<DespesaDto[]>([]);
  const [tiposDespesa, setTiposDespesa] = useState<{ id: number; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [despesaToEdit, setDespesaToEdit] = useState<DespesaDto | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const verificarAutenticacao = async () => {
      try {
        await authService.getUserInfo();
        setIsAuth(true);
        carregarDados();
      } catch (error) {
        console.error("Erro na autenticação:", error);
        setIsAuth(false);
        router.push("/login");
      }
    };

    verificarAutenticacao();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const tiposResponse = await tipoDespesaService.listarTipoDespesas();
      setTiposDespesa(tiposResponse);

      const despesasResponse = await despesaService.listarPorUsuario();
      setDespesas(despesasResponse);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar as despesas. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (despesa: DespesaDto) => {
    setDespesaToEdit(despesa);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await despesaService.deletarDespesa(id);
      setDespesas(despesas.filter(d => d.id !== id));
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  };

  const handleAddNew = () => {
    setDespesaToEdit(null); 
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setDespesaToEdit(null);
  };

  const handleSaveDespesa = async (despesa: DespesaDto) => {
    try {
      if (despesa.id) {
        const despesaAtualizada = await despesaService.atualizarDespesa(despesa);
        setDespesas(despesas.map(d => d.id === despesa.id ? despesaAtualizada : d));
      } else {
        const novaDespesa = await despesaService.adicionarDespesa(despesa);
        setDespesas([...despesas, novaDespesa]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full p-6 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-dark-purple">Minhas Despesas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Adicionar despesa"
              title="Adicionar despesa"
            >
              <Plus size={20} />
            </button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {isLoading ? (
            <p>Carregando despesas...</p>
          ) : despesas.length === 0 ? (
            <p className="text-gray-600">Nenhuma despesa encontrada.</p>
          ) : (
            <div className="space-y-4">
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
      </div>
    </div>
  );
}
