'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
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
  const [filtroVariavel, setFiltroVariavel] = useState<boolean | null>(null);
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
      // Carrega dados das rendas
      const rendasResponse = await rendaService.listarPorUsuario();
      setRendas(rendasResponse);

      // Carrega dados do gráfico
      console.log("[Rendas] Iniciando carregamento dos dados do gráfico");
      const graficoResponse = await dashboardService.buscarPorcentagemDeRendas();
      console.log("[Rendas] Resposta completa do dashboard:", graficoResponse);
      
      if (graficoResponse) {
        console.log("[Rendas] Tipo da resposta:", typeof graficoResponse);
        console.log("[Rendas] Chaves do objeto:", Object.keys(graficoResponse));
        
        // Verificar se temos o formato específico do backend
        if (graficoResponse.porcentagensPorVariavel) {
          console.log("[Rendas] Encontrado porcentagensPorVariavel");
          // Tratar os dados para exibir Sim/Não em vez de true/false
          const dadosFormatados = graficoResponse.porcentagensPorVariavel.map(item => ({
            ...item,
            // Converter booleano para texto mais amigável
            variavel: item.variavel === true ? "Variável" : "Fixa"
          }));
          setDadosGrafico(dadosFormatados);
        } 
        // Checagem para outros formatos potenciais
        else if (Array.isArray(graficoResponse)) {
          console.log("[Rendas] Resposta é um array");
          setDadosGrafico(graficoResponse);
        } 
        else if (graficoResponse.PorcentagensVariavel) {
          console.log("[Rendas] Encontrado PorcentagensVariavel (PascalCase)");
          setDadosGrafico(graficoResponse.PorcentagensVariavel);
        } 
        else if (graficoResponse.porcentagensVariavel) {
          console.log("[Rendas] Encontrado porcentagensVariavel (camelCase)");
          setDadosGrafico(graficoResponse.porcentagensVariavel);
        } 
        else {
          console.log("[Rendas] Formato desconhecido, verificando outras propriedades");
          // Se for um objeto único
          const temPropriedadesDeVariavel = graficoResponse.Variavel !== undefined || 
                                         graficoResponse.variavel !== undefined;
          
          if (temPropriedadesDeVariavel) {
            console.log("[Rendas] O objeto parece ser um único item de porcentagem");
            setDadosGrafico([graficoResponse]);
          } else {
            console.log("[Rendas] Formato desconhecido, não foi possível extrair dados para o gráfico");
            setDadosGrafico([]);
          }
        }
      } else {
        console.warn("[Rendas] Resposta nula ou indefinida do dashboard");
        setDadosGrafico([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar os dados. Por favor, tente novamente.");
      setDadosGrafico([]);
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

  // Função para filtrar rendas baseado na pesquisa e filtro
  const rendasFiltradas = rendas.filter(renda => {
    // Filtro por tipo (variável/fixa)
    const passaFiltroTipo = filtroVariavel === null || renda.variavel === filtroVariavel;
    
    // Filtro por pesquisa (nome/descrição)
    const passaFiltroPesquisa = pesquisa === "" || 
      renda.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      (renda.nome && renda.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    
    return passaFiltroTipo && passaFiltroPesquisa;
  });

  const limparFiltros = () => {
    setPesquisa("");
    setFiltroVariavel(null);
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full p-6 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Rendas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              aria-label="Adicionar renda"
            >
              <Plus size={20} />
              <span className="hidden sm:inline cursor-pointer">Adicionar Renda</span>
            </button>
          </div>

          {/* Barra de Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              
              {/* Barra de Pesquisa */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar rendas
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Digite o nome ou descrição da renda..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtro por Tipo */}
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de renda
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white cursor-pointer"
                    value={filtroVariavel === null ? "" : String(filtroVariavel)}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor === "") {
                        setFiltroVariavel(null);
                      } else {
                        setFiltroVariavel(valor === "true");
                      }
                    }}
                  >
                    <option value="">Todas</option>
                    <option value="false">Renda Fixa</option>
                    <option value="true">Renda Variável</option>
                  </select>
                  {/* Seta customizada para o select */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Botão Limpar Filtros */}
              {(pesquisa || filtroVariavel !== null) && (
                <button
                  onClick={limparFiltros}
                  className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {rendasFiltradas.length === 0 
                  ? "Nenhuma renda encontrada" 
                  : `${rendasFiltradas.length} ${rendasFiltradas.length === 1 ? 'renda encontrada' : 'rendas encontradas'}`
                }
                {rendas.length > 0 && ` de ${rendas.length} total`}
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Lista de Rendas */}
            <div className="flex-1">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando rendas...</p>
                </div>
              ) : rendasFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">
                    {pesquisa || filtroVariavel !== null
                      ? 'Nenhuma renda encontrada com os filtros aplicados'
                      : 'Nenhuma renda cadastrada'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {pesquisa || filtroVariavel !== null
                      ? 'Tente ajustar os filtros ou limpar a pesquisa'
                      : 'Comece adicionando sua primeira renda'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rendasFiltradas.map((renda) => (
                    <RendaCard
                      key={renda.id}
                      renda={renda}
                      onEdit={handleEdit}
                      onDelete={() => solicitarConfirmacaoExclusao(renda)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Gráfico de rendas por variável */}
            <div className="lg:w-1/2">
                <GraficoRendasPorVariavel data={dadosGrafico} />
            </div>
          </div>

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