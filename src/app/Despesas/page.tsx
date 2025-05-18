'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { authService } from "@/services/authService";
import { despesaService } from "@/services/despesaService";
import { tipoDespesaService } from "@/services/tipoDespesaService";

import SidePannel from "../components/SidePannel/SidePannel";
import DespesaCard from "../components/Despesa/DespesaCard";
import NovaDespesaModal from "../components/Despesa/NovaDespesaModal";
import ConfirmModal from "../components/UI/ConfirmModal";

import { DespesaDto } from "@/Interfaces/Despesa/DespesaDto";

export default function Despesas() {
  const [isLoading, setIsLoading] = useState(true);
  const [despesas, setDespesas] = useState<DespesaDto[]>([]);
  const [tiposDespesa, setTiposDespesa] = useState<{ id: number; descricao: string }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [despesaToEdit, setDespesaToEdit] = useState<DespesaDto | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [despesaToDelete, setDespesaToDelete] = useState<DespesaDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const autenticarECarregar = async () => {
      try {
        await authService.getUserInfo();
        await carregarDados();
      } catch (err) {
        console.error("Erro de autenticação:", err);
        router.push("/login");
      }
    };

    autenticarECarregar();
  }, [router]);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tipos, despesas] = await Promise.all([
        tipoDespesaService.listarTipoDespesas(),
        despesaService.listarPorUsuario(),
      ]);
      setTiposDespesa(tipos);
      setDespesas(despesas);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar as despesas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setDespesaToEdit(null);
    setShowAddModal(true);
  };

  const handleEdit = (despesa: DespesaDto) => {
    setDespesaToEdit(despesa);
    setShowAddModal(true);
  };

  const solicitarConfirmacaoExclusao = (despesa: DespesaDto) => {
    setDespesaToDelete(despesa);
    setConfirmDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!despesaToDelete) return;

    try {
      await despesaService.deletarDespesa(despesaToDelete.id);
      setDespesas((prev) => prev.filter((d) => d.id !== despesaToDelete.id));
    } catch (err) {
      console.error("Erro ao excluir despesa:", err);
      setError("Não foi possível excluir a despesa. Tente novamente.");
    } finally {
      setConfirmDeleteModalOpen(false);
      setDespesaToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setDespesaToEdit(null);
  };

  const handleDespesaAdicionada = (despesa: DespesaDto) => {
    setDespesas((prev) => {
      const index = prev.findIndex((d) => d.id === despesa.id);
      if (index >= 0) {
        const novaLista = [...prev];
        novaLista[index] = despesa;
        return novaLista;
      }
      return [...prev, despesa];
    });
  };

  return (
    <div className="flex h-screen relative">
      <SidePannel />

      <main className="w-full p-6 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-dark-purple">Minhas Despesas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Adicionar despesa"
              title="Adicionar despesa"
              type="button"
            >
              <Plus size={20} />
            </button>
          </header>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {isLoading ? (
            <p>Carregando despesas...</p>
          ) : despesas.length === 0 ? (
            <p className="text-gray-600">Nenhuma despesa encontrada.</p>
          ) : (
            <section className="space-y-4" aria-live="polite" aria-atomic="true">
              {despesas.map((despesa) => (
                <DespesaCard
                  key={despesa.id}
                  despesa={despesa}
                  onEdit={handleEdit}
                  onDelete={() => solicitarConfirmacaoExclusao(despesa)}
                  tiposDespesa={tiposDespesa}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {showAddModal && (
        <NovaDespesaModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onDespesaAdicionada={handleDespesaAdicionada}
          tiposDespesa={tiposDespesa}
          despesaEdicao={despesaToEdit}
        />
      )}

      <ConfirmModal
        isOpen={confirmDeleteModalOpen}
        message={`Tem certeza que deseja excluir a despesa "${despesaToDelete?.descricao}"?`}
        onConfirm={confirmarExclusao}
        onCancel={() => setConfirmDeleteModalOpen(false)}
      />
    </div>
  );
}
