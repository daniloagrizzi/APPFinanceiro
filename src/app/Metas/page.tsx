'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { authService } from "@/services/authService";
import { metaService } from "@/services/metaService";

import SidePannel from "../components/SidePannel/SidePannel";
import MetaCard from "../components/Meta/MetaCard";
import NovaMetaModal from "../components/Meta/NovaMetaModal";
import ConfirmModal from "../components/UI/ConfirmModal";

import { MetaDto } from "@/Interfaces/Meta/MetaDto";

export default function Metas() {
  const [isAuth, setIsAuth] = useState(false);
  const [metas, setMetas] = useState<MetaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [metaToEdit, setMetaToEdit] = useState<MetaDto | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState<MetaDto | null>(null);

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
  }, [router]);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const metasResponse = await metaService.listarPorUsuario();
      setMetas(metasResponse);
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      setError("Não foi possível carregar os dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (meta: MetaDto) => {
    setMetaToEdit(meta);
    setShowAddModal(true);
  };

  const solicitarConfirmacaoExclusao = (meta: MetaDto) => {
    setMetaToDelete(meta);
    setConfirmDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (metaToDelete) {
      try {
        await metaService.deletarMeta(metaToDelete.id);
        setMetas(metas.filter(m => m.id !== metaToDelete.id));
      } catch (error) {
        console.error("Erro ao excluir meta:", error);
      } finally {
        setConfirmDeleteModalOpen(false);
        setMetaToDelete(null);
      }
    }
  };

  const handleAddNew = () => {
    setMetaToEdit(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setMetaToEdit(null);
  };

  const handleMetaAdicionada = (meta: MetaDto) => {
    const index = metas.findIndex(m => m.id === meta.id);
    if (index >= 0) {
      const novasMetas = [...metas];
      novasMetas[index] = meta;
      setMetas(novasMetas);
    } else {
      setMetas([...metas, meta]);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full p-6 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-dark-purple">Minhas Metas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Adicionar meta"
              title="Adicionar meta"
            >
              <Plus className="cursor-pointer" size={20} />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col gap-6">
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {isLoading ? (
              <p>Carregando metas...</p>
            ) : metas.length === 0 ? (
              <p className="text-gray-600">Nenhuma meta encontrada.</p>
            ) : (
              <div className="space-y-4">
                {metas.map((meta) => (
                  <MetaCard
                    key={meta.id}
                    meta={meta}
                    onEdit={handleEdit}
                    onDelete={() => solicitarConfirmacaoExclusao(meta)}
                  />
                ))}
              </div>
            )}
          </div>

          <NovaMetaModal
            isOpen={showAddModal}
            onClose={handleCloseModal}
            onMetaAdicionada={handleMetaAdicionada}
            metaEdicao={metaToEdit}
          />

          <ConfirmModal
            isOpen={confirmDeleteModalOpen}
            message={`Tem certeza que deseja excluir a meta "${metaToDelete?.nome}"?`}
            onConfirm={confirmarExclusao}
            onCancel={() => setConfirmDeleteModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
