"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";
import RendasContainer from "../components/Renda/RendaContainer";
import { RendaDto } from '@/Interfaces/Renda/RendaDto';
import NovaRendaModal from "../components/Renda/NovaRendaModal";

export default function PerfilFinanceiro() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
    Id: '',
    Email: '',
    UserName: '',
  });
  const [showAddRendaModal, setShowAddRendaModal] = useState(false);
  const [editingRenda, setEditingRenda] = useState<RendaDto | null>(null);
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

  const handleOpenAddModal = () => {
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

  const handleRendaAdicionada = () => {
  setShowAddRendaModal(false);
  setRefreshKey(prev => prev + 1);
};

  if (!isAuth) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidePannel />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Perfil Financeiro</h1>

        <RendasContainer
          key={refreshKey}
          onAdd={handleOpenAddModal}
          onEdit={handleEditRenda}
        />
      </main>
      <NovaRendaModal
  isOpen={showAddRendaModal}
  onClose={() => setShowAddRendaModal(false)}
  onRendaAdicionada={handleRendaAdicionada}
/>

    </div>
  );
}
