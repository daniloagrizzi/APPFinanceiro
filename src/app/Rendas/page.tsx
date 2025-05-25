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
  const [filtroVariavel, setFiltroVariavel] = useState<boolean | null>(null);
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

  const rendasFiltradas = filtroVariavel === null
  ? rendas
  : rendas.filter(r => r.variavel === filtroVariavel);
  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
    <SidePannel />

    <div className="w-full p-6 overflow-auto bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-dark-purple">Minhas Rendas</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            aria-label="Adicionar renda"
            title="Adicionar renda"
          >
            <Plus className="cursor-pointer" size={20} />
          </button>
        </div>

        {/* Filtro */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar rendas
          </label>
          <select
            className="border border-gray-300 rounded-md p-2 text-gray-900"
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
            <option value="false">Fixa</option>
            <option value="true">Variável</option>
          </select>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Lista de Rendas */}
          <div className="flex-1">
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {isLoading ? (
              <p>Carregando rendas...</p>
            ) : rendasFiltradas.length === 0 ? (
              <p className="text-gray-600">
                {filtroVariavel === true
                  ? 'Nenhuma renda variável encontrada.'
                  : filtroVariavel === false
                  ? 'Nenhuma renda fixa encontrada.'
                  : 'Nenhuma renda encontrada.'}
              </p>
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
            <div className="md:w-1/2">
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