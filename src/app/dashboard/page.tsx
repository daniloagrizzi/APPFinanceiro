'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Tag, Repeat } from 'lucide-react';
import { authService } from "@/services/authService";
import { dashboardService, BalancoFinanceiroDto, DespesasPorcentagemPorTipoDto } from "@/services/dashboardService";
import SidePannel from "../components/SidePannel/SidePannel";
import FinancialBalanceCard from '../components/Dashboard/FinancialBalanceCard';

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
    Id: '',
    Email: '',
    UserName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // Buscar informações do usuário
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
        // Redirecionar para login se houver erro de autenticação
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
    <div className="flex h-screen bg-gray-50">
      <SidePannel />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Financeiro
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {userInfo.UserName}! Aqui está sua visão geral financeira.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Card de Balanço Financeiro */}
            <div className="lg:col-span-1">
              <FinancialBalanceCard />
            </div>

            </div>
          </div>
        </div>
      </div>
  );
}