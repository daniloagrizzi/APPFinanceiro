'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';

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
  const [pesquisa, setPesquisa] = useState<string>("");

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

  const metasFiltradas = metas.filter(meta => {
    return pesquisa === "" || meta.nome.toLowerCase().includes(pesquisa.toLowerCase());
  });

  const limparPesquisa = () => {
    setPesquisa("");
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full p-6 overflow-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Metas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              aria-label="Adicionar meta"
            >
              <Plus size={20} />
              <span className="hidden sm:inline cursor-pointer">Adicionar Meta</span>
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              
              {/* Campo de Pesquisa */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar metas
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Digite o nome da meta..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                  />
                </div>
              </div>

              {/* Botão Limpar Pesquisa */}
              {pesquisa && (
                <button
                  onClick={limparPesquisa}
                  className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {metasFiltradas.length === 0 
                  ? "Nenhuma meta encontrada" 
                  : `${metasFiltradas.length} ${metasFiltradas.length === 1 ? 'meta encontrada' : 'metas encontradas'}`
                }
                {metas.length > 0 && ` de ${metas.length} total`}
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando metas...</p>
              </div>
            ) : metasFiltradas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  {pesquisa
                    ? 'Nenhuma meta encontrada com a pesquisa aplicada'
                    : 'Nenhuma meta cadastrada'}
                </p>
                <p className="text-gray-500 text-sm">
                  {pesquisa
                    ? 'Tente ajustar a pesquisa ou limpar o campo'
                    : 'Comece adicionando sua primeira meta'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {metasFiltradas.map((meta) => (
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