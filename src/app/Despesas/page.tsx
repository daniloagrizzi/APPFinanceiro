"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter } from "lucide-react";

import { authService } from "@/services/authService";
import { despesaService } from "@/services/despesaService";
import { tipoDespesaService } from "@/services/tipoDespesaService";
import { dashboardService, TipoDespesaComPorcentagemDto } from "@/services/dashboardService";

import SidePannel from "../components/SidePannel/SidePannel";
import DespesaCard from "../components/Despesa/DespesaCard";
import NovaDespesaModal from "../components/Despesa/NovaDespesaModal";
import ConfirmModal from "../components/UI/ConfirmModal";
import GraficoDespesasPorTipo from "../components/Despesa/GraficoDespesasPorTipo";

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
  const [graficoData, setGraficoData] = useState<TipoDespesaComPorcentagemDto[]>([]);
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<number | null>(null);
  const [pesquisa, setPesquisa] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    async function autenticarECarregar() {
      try {
        await authService.getUserInfo();
        await carregarDados();
      } catch (err) {
        console.error("Erro de autenticação:", err);
        router.push("/login");
      }
    }

    autenticarECarregar();
  }, [router]);

  const atualizarDadosGrafico = async () => {
  try {
    const response = await dashboardService.buscarPorcentagemDeDespesas();

    if (!response) {
      setGraficoData([]);
      return;
    }

    // Check if response is an array
    if (Array.isArray(response)) {
      if (response.length === 0) {
        setGraficoData([]);
      } else {
        // Get the first item from the array
        const firstItem = response[0];
        
        if (firstItem.PorcentagensPorTipo) {
          setGraficoData(firstItem.PorcentagensPorTipo);
        } else if (firstItem.porcentagensPorTipo) {
          setGraficoData(firstItem.porcentagensPorTipo);
        } else {
          // If the array items themselves are TipoDespesaComPorcentagemDto objects
          const hasExpectedProperties = response.every(item => 
            item.Tipo !== undefined || item.tipo !== undefined
          );
          if (hasExpectedProperties) {
            setGraficoData(response);
          } else {
            setGraficoData([]);
          }
        }
      }
    } else {
      // Response is a single DespesasPorcentagemPorTipoDto object
      if (response.PorcentagensPorTipo) {
        setGraficoData(response.PorcentagensPorTipo);
      } else if ((response as any).porcentagensPorTipo) {
        setGraficoData((response as any).porcentagensPorTipo);
      } else {
        // This case is unlikely given the interface, but keeping for safety
        setGraficoData([]);
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar dados do gráfico:", error);
    setGraficoData([]);
  }
};
  
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
  
      await atualizarDadosGrafico();
  
    } catch (err) {
      console.error("[Despesas] Erro ao carregar dados principais:", err);
      setError("Não foi possível carregar as despesas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  

  function handleAddNew() {
    setDespesaToEdit(null);
    setShowAddModal(true);
  }

  function handleEdit(despesa: DespesaDto) {
    setDespesaToEdit(despesa);
    setShowAddModal(true);
  }

  function solicitarConfirmacaoExclusao(despesa: DespesaDto) {
    setDespesaToDelete(despesa);
    setConfirmDeleteModalOpen(true);
  }

  const confirmarExclusao = async () => {
    if (!despesaToDelete) return;
  
    try {
      await despesaService.deletarDespesa(despesaToDelete.id);
      setDespesas((prev) => prev.filter((d) => d.id !== despesaToDelete.id));
      await atualizarDadosGrafico();
    } catch (err) {
      console.error("Erro ao excluir despesa:", err);
      setError("Não foi possível excluir a despesa. Tente novamente.");
    } finally {
      setConfirmDeleteModalOpen(false);
      setDespesaToDelete(null);
    }
  };
  
  function handleCloseModal() {
    setShowAddModal(false);
    setDespesaToEdit(null);
  }

  const handleDespesaAdicionada = async (despesa: DespesaDto) => {
    setDespesas((prev) => {
      const index = prev.findIndex((d) => d.id === despesa.id);
      if (index >= 0) {
        const novaLista = [...prev];
        novaLista[index] = despesa;
        return novaLista;
      }
      return [...prev, despesa];
    });
    await atualizarDadosGrafico();
  };

  // Função para filtrar despesas baseado na pesquisa e filtros
  const despesasFiltradas = despesas.filter(despesa => {
    // Filtro por prioridade
    const passaFiltroPrioridade = !filtroPrioridade || despesa.prioridade === filtroPrioridade;
    
    // Filtro por tipo
    const passaFiltroTipo = filtroTipo === null || despesa.tipoDespesaId === filtroTipo;
    
    // Filtro por pesquisa (nome/descrição)
    const passaFiltroPesquisa = pesquisa === "" || 
      despesa.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (despesa.descricao && despesa.descricao.toLowerCase().includes(pesquisa.toLowerCase()));
    
    return passaFiltroPrioridade && passaFiltroTipo && passaFiltroPesquisa;
  });

  const limparFiltros = () => {
    setPesquisa("");
    setFiltroPrioridade("");
    setFiltroTipo(null);
  };

  const temFiltrosAtivos = pesquisa || filtroPrioridade || filtroTipo !== null;

  return (
    <div className="flex h-screen relative">
      <SidePannel />

      <main className="w-full p-6 overflow-auto bg-gray-50 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Despesas</h1>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              aria-label="Adicionar nova despesa"
            >
              <Plus size={20} />
              <span className="hidden sm:inline cursor-pointer">Adicionar Despesa</span>
            </button>
          </div>

          {/* Barra de Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              
              {/* Barra de Pesquisa */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar despesas
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Digite o nome ou descrição da despesa..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtro por Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white cursor-pointer"
                    value={filtroPrioridade}
                    onChange={(e) => setFiltroPrioridade(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de despesa
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white cursor-pointer"
                    value={filtroTipo || ""}
                    onChange={(e) => setFiltroTipo(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Todos os tipos</option>
                    {tiposDespesa.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.descricao}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Limpar Filtros */}
            {temFiltrosAtivos && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Contador de resultados */}
            <div className={`${temFiltrosAtivos ? 'mt-2' : 'mt-4'} ${temFiltrosAtivos ? '' : 'pt-4 border-t border-gray-100'}`}>
              <p className="text-sm text-gray-600">
                {despesasFiltradas.length === 0 
                  ? "Nenhuma despesa encontrada" 
                  : `${despesasFiltradas.length} ${despesasFiltradas.length === 1 ? 'despesa encontrada' : 'despesas encontradas'}`
                }
                {despesas.length > 0 && ` de ${despesas.length} total`}
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Lista de Despesas */}
            <div className="flex-1">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando despesas...</p>
                </div>
              ) : despesasFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">
                    {temFiltrosAtivos
                      ? 'Nenhuma despesa encontrada com os filtros aplicados'
                      : 'Nenhuma despesa cadastrada'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {temFiltrosAtivos
                      ? 'Tente ajustar os filtros ou limpar a pesquisa'
                      : 'Comece adicionando sua primeira despesa'}
                  </p>
                </div>
              ) : (
                <section className="space-y-4">
                  {despesasFiltradas.map((despesa) => (
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

            {/* Gráfico de despesas por tipo */}
            <div className="lg:w-1/2">
                <GraficoDespesasPorTipo data={graficoData} />
            </div>
          </div>
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