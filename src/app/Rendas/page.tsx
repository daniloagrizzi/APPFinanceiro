'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { authService } from "@/services/authService";
import { rendaService } from "@/services/rendaService";
import { dashboardService } from "@/services/dashboardService";
import SidePannel from "../components/SidePannel/SidePannel";
import RendaCard from "../components/Renda/RendaCard";
import { RendaDto } from "@/Interfaces/Renda/RendaDto";
import NovaRendaModal from "../components/Renda/NovaRendaModal";
import ConfirmModal from "../components/UI/ConfirmModal";
import GraficoRendasPorVariavel from "../components/Renda/GraficoRendasPorVariavel";

export default function Rendas() {
  const [isAuth, setIsAuth] = useState(false);
  const [rendas, setRendas] = useState<RendaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rendaToEdit, setRendaToEdit] = useState<RendaDto | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [rendaToDelete, setRendaToDelete] = useState<RendaDto | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

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
      // Carrega dados das rendas
      const rendasResponse = await rendaService.listarPorUsuario();
      setRendas(rendasResponse);

      // Carrega dados do gráfico
      const graficoResponse = await dashboardService.buscarPorcentagemDeRendas();
      setDadosGrafico(graficoResponse.PorcentagensVariavel || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar os dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (renda: RendaDto) => {
    setRendaToEdit(renda);
    setShowAddModal(true);
  };

  const solicitarConfirmacaoExclusao = (renda: RendaDto) => {
    setRendaToDelete(renda);
    setConfirmDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (rendaToDelete) {
      try {
        await rendaService.deletarRenda(rendaToDelete.id);
        setRendas(rendas.filter(r => r.id !== rendaToDelete.id));
        // Recarregar dados após excluir para atualizar o gráfico
        carregarDados();
      } catch (error) {
        console.error("Erro ao excluir renda:", error);
      } finally {
        setConfirmDeleteModalOpen(false);
        setRendaToDelete(null);
      }
    }
  };

  const handleAddNew = () => {
    setRendaToEdit(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setRendaToEdit(null);
  };

  const handleRendaAdicionada = (renda: RendaDto) => {
    const index = rendas.findIndex(r => r.id === renda.id);
    if (index >= 0) {
      const novasRendas = [...rendas];
      novasRendas[index] = renda;
      setRendas(novasRendas);
    } else {
      setRendas([...rendas, renda]);
    }
    // Recarregar dados após adicionar/editar para atualizar gráfico
    carregarDados();
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full p-6 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-dark-purple">Minhas Rendas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Adicionar renda"
              title="Adicionar renda"
            >
              <Plus size={20} />
            </button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {isLoading ? (
            <p>Carregando rendas...</p>
          ) : rendas.length === 0 ? (
            <p className="text-gray-600">Nenhuma renda encontrada.</p>
          ) : (
            <div className="space-y-4">
              {rendas.map(renda => (
                <RendaCard
                  key={renda.id}
                  renda={renda}
                  onEdit={handleEdit}
                  onDelete={() => solicitarConfirmacaoExclusao(renda)}
                />
              ))}
            </div>
          )}

          {/* Gráfico de rendas por variável */}
          {dadosGrafico && dadosGrafico.length > 0 && (
            <div className="mt-8">
              <GraficoRendasPorVariavel data={dadosGrafico} />
            </div>
          )}

          <NovaRendaModal
            isOpen={showAddModal}
            onClose={handleCloseModal}
            onRendaAdicionada={handleRendaAdicionada}
            editingRenda={rendaToEdit}
          />

          <ConfirmModal
            isOpen={confirmDeleteModalOpen}
            message={`Tem certeza que deseja excluir a renda "${rendaToDelete?.descricao}"?`}
            onConfirm={confirmarExclusao}
            onCancel={() => setConfirmDeleteModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}