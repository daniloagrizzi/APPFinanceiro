'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";
import RendasContainer from "../components/Renda/RendaContainer";
import DespesasContainer from "../components/Despesa/DespesaContainer";
import NovaRendaModal from "../components/Renda/NovaRendaModal";
import NovaDespesaModal from "../components/Despesa/NovaDespesaModal";
import { RendaDto } from '@/Interfaces/Renda/RendaDto';
import { DespesaDto } from "@/Interfaces/Despesa/DespesaDto";

export default function PerfilFinanceiro() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
    Id: '',
    Email: '',
    UserName: '',
  });

  const [showAddRendaModal, setShowAddRendaModal] = useState(false);
  const [editingRenda, setEditingRenda] = useState<RendaDto | null>(null);

  const [showAddDespesaModal, setShowAddDespesaModal] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<DespesaDto | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const data = await authService.getUserInfo();
        setUserInfo({
          UserName: data.UserName || data.userName,
          Email: data.Email || data.email,
          Id: data.Id || data.id
        });
        setIsAuth(true);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        setIsAuth(false);
        router.push("/login");
      }
    };

    fetchUserInfo();
  }, []);

  const handleOpenAddRendaModal = () => {
    setEditingRenda(null);
    setShowAddRendaModal(true);
  };

  const handleEditRenda = (renda: RendaDto) => {
    setEditingRenda(renda);
    setShowAddRendaModal(true);
  };

  const handleRendaSaved = () => {
    setShowAddRendaModal(false);
    setEditingRenda(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenAddDespesaModal = () => {
    setEditingDespesa(null);
    setShowAddDespesaModal(true);
  };

  const handleEditDespesa = (despesa: DespesaDto) => {
    setEditingDespesa(despesa);
    setShowAddDespesaModal(true);
  };

  const handleDespesaSaved = () => {
    setShowAddDespesaModal(false);
    setEditingDespesa(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleDespesaAdicionada = () => {
    // Lógica para quando a despesa for adicionada
    setShowAddDespesaModal(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleRendaAdicionada = () => {
    // Lógica para quando a renda for adicionada
    setShowAddRendaModal(false);
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuth) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidePannel />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-4">Perfil Financeiro</h1>

        <RendasContainer
          key={refreshKey}
          onAdd={handleOpenAddRendaModal}
          onEdit={handleEditRenda}
        />

        <DespesasContainer
          key={`${refreshKey}-despesa`}
          onAdd={handleOpenAddDespesaModal}
          onEdit={handleEditDespesa}
        />
      </main>

      {/* Modais */}
      {showAddRendaModal && (
        <NovaRendaModal
          isOpen={showAddRendaModal}
          onClose={() => setShowAddRendaModal(false)}
          onSaved={handleRendaSaved}
          editingRenda={editingRenda}
          onRendaAdicionada={handleRendaAdicionada} 
        />
      )}

      {showAddDespesaModal && (
        <NovaDespesaModal
          isOpen={showAddDespesaModal}
          onClose={() => setShowAddDespesaModal(false)}
          onSaved={handleDespesaSaved}
          editingDespesa={editingDespesa}
          onDespesaAdicionada={handleDespesaAdicionada} 
        />
      )}
    </div>
  );
}
