'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { AlertTriangle, Settings } from 'lucide-react';
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";
import FinancialBalanceCard from '../components/Dashboard/FinancialBalanceCard';
import MonthlyEvolutionCard from '../components/Dashboard/MonthlyEvolutionCard';
import FinancialManagerModal from '../components/Dashboard/FinancialManagerModal'; 

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
    Id: '',
    Email: '',
    UserName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userData = await authService.getUserInfo();
        setUserInfo({
          UserName: userData.UserName || userData.userName || '', 
          Email: userData.Email || userData.email || '',
          Id: userData.Id || userData.id || ''
        });
        setIsAuth(true);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Erro ao carregar dados do usuário');
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (!isAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {!isAuth ? "Verificando autenticação..." : "Carregando dados financeiros..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Side Panel */}
      <SidePannel />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="pl-16 lg:pl-0"> {/* Add left padding on mobile to avoid menu button */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Dashboard Financeiro
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Bem-vindo, {userInfo.UserName}! Aqui está sua visão geral financeira.
              </p>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                onClick={() => setIsManagerModalOpen(true)}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer
                  bg-gradient-to-r from-[#221DAF] via-[#5A55D5] to-[#6291D8] 
                  hover:from-[#1e1a9e] hover:via-[#4745b6] hover:to-[#598ef1]
                  text-sm sm:text-base"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                <span className="font-medium">Usar gerenciador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2 order-2 xl:order-1">
              <div className="h-[400px] sm:h-[500px] xl:h-[calc(100vh-200px)]">
                <MonthlyEvolutionCard />
              </div>
            </div>
            
            <div className="xl:col-span-1 order-1 xl:order-2">
              <div className="h-auto xl:h-[calc(100vh-200px)] flex items-start">
                <div className="w-full">
                  <FinancialBalanceCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FinancialManagerModal 
        isOpen={isManagerModalOpen} 
        onClose={() => setIsManagerModalOpen(false)} 
      />
    </div>
  );
}