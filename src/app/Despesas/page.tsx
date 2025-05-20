"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('');

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
      
      try {
        console.log("[Despesas] Iniciando carregamento dos dados do gráfico");
        const porcentagensResponse = await dashboardService.buscarPorcentagemDeDespesas();
        console.log("[Despesas] Resposta completa do dashboard:", porcentagensResponse);
        
        if (porcentagensResponse) {
          console.log("[Despesas] Tipo da resposta:", typeof porcentagensResponse);
          
          if (Array.isArray(porcentagensResponse)) {
            console.log("[Despesas] Resposta é um array com", porcentagensResponse.length, "itens");
            
            if (porcentagensResponse.length > 0) {
              console.log("[Despesas] Primeiro item do array:", porcentagensResponse[0]);
              console.log("[Despesas] Chaves do primeiro item:", Object.keys(porcentagensResponse[0]));
              
              if (porcentagensResponse[0].PorcentagensPorTipo) {
                console.log("[Despesas] Encontrado PorcentagensPorTipo (PascalCase)");
                setGraficoData(porcentagensResponse[0].PorcentagensPorTipo);
              } else if (porcentagensResponse[0].porcentagensPorTipo) {
                console.log("[Despesas] Encontrado porcentagensPorTipo (camelCase)");
                setGraficoData(porcentagensResponse[0].porcentagensPorTipo);
              } else {
                console.log("[Despesas] Nenhum campo de porcentagens encontrado no objeto");
                
                const temPropriedadesDeTipoDespesa = porcentagensResponse[0].Tipo !== undefined || 
                                                   porcentagensResponse[0].tipo !== undefined;
                
                if (temPropriedadesDeTipoDespesa) {
                  console.log("[Despesas] O array parece conter diretamente os itens de porcentagem");
                  setGraficoData(porcentagensResponse);
                } else {
                  console.log("[Despesas] Formato desconhecido, não foi possível extrair dados para o gráfico");
                  setGraficoData([]);
                }
              }
            } else {
              console.log("[Despesas] Array vazio recebido");
              setGraficoData([]);
            }
          } else {
            console.log("[Despesas] Resposta é um objeto");
            console.log("[Despesas] Chaves do objeto:", Object.keys(porcentagensResponse));
            
            if (porcentagensResponse.PorcentagensPorTipo) {
              console.log("[Despesas] Encontrado PorcentagensPorTipo (PascalCase)");
              setGraficoData(porcentagensResponse.PorcentagensPorTipo);
            } else if (porcentagensResponse.porcentagensPorTipo) {
              console.log("[Despesas] Encontrado porcentagensPorTipo (camelCase)");
              setGraficoData(porcentagensResponse.porcentagensPorTipo);
            } else {
              // Verificar se o próprio objeto já é um item único de resposta
              const temPropriedadesDeTipoDespesa = porcentagensResponse.Tipo !== undefined || 
                                                 porcentagensResponse.tipo !== undefined;
              
              if (temPropriedadesDeTipoDespesa) {
                console.log("[Despesas] O objeto parece ser um único item de porcentagem");
                setGraficoData([porcentagensResponse]);
              } else {
                console.log("[Despesas] Formato desconhecido, não foi possível extrair dados para o gráfico");
                setGraficoData([]);
              }
            }
          }
        } else {
          console.warn("[Despesas] Resposta nula ou indefinida do dashboard");
          setGraficoData([]);
        }
      } catch (graphErr) {
        console.error("[Despesas] Erro ao carregar dados do gráfico:", graphErr);
        setGraficoData([]);
      }
    } catch (err) {
      console.error("[Despesas] Erro ao carregar dados principais:", err);
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
      
      // Recarregar dados do gráfico após exclusão
      try {
        const porcentagensResponse = await dashboardService.buscarPorcentagemDeDespesas();
        if (porcentagensResponse && porcentagensResponse.PorcentagensPorTipo) {
          setGraficoData(porcentagensResponse.PorcentagensPorTipo);
        }
      } catch (graphErr) {
        console.error("Erro ao atualizar dados do gráfico:", graphErr);
      }
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
    
    try {
      const porcentagensResponse = await dashboardService.buscarPorcentagemDeDespesas();
      if (porcentagensResponse && porcentagensResponse.PorcentagensPorTipo) {
        setGraficoData(porcentagensResponse.PorcentagensPorTipo);
      }
    } catch (graphErr) {
      console.error("Erro ao atualizar dados do gráfico:", graphErr);
    }
  };

  const despesasFiltradas = filtroPrioridade 
    ? despesas.filter(d => d.prioridade === filtroPrioridade)
    : despesas;

  return (
    <div className="flex h-screen relative">
      <SidePannel />

      <main className="w-full p-6 overflow-auto bg-white z-10">
        <div className="w-full mx-auto"> 
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-dark-purple">Minhas Despesas</h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </header>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por prioridade</label>
            <select
              className="border border-gray-300 rounded-md p-2 text-gray-900"
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
            >
              <option value="">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              {error && <p className="text-red-600 mb-4">{error}</p>}
              {isLoading ? (
                <p>Carregando despesas...</p>
              ) : despesasFiltradas.length === 0 ? (
                <p className="text-gray-600">
                  {filtroPrioridade 
                    ? `Nenhuma despesa encontrada com prioridade ${filtroPrioridade}.` 
                    : 'Nenhuma despesa encontrada.'}
                </p>
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

            <div className="md:w-1/2">
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