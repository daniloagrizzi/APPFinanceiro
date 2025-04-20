'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuth(true);
      const userName = localStorage.getItem("userName");
      setUsername(userName || "Otário");
    }
  }, []);

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#221DAF] to-white">
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-white">Wo! Money</h1>
        </div>
        <div className="w-45 h-45 rounded-full overflow-hidden shadow-md mr-4">
        <img src="/perfil.jpg" alt="Perfil" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Bem-vindo, <span className="font-extrabold">{username}</span>!
        </h2>
      </div>

      <div className="container mx-auto px-4 py-8 bg-white rounded-t-3xl min-h-[70vh] shadow-lg">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md mr-4">
            <img src="/perfil.jpg" alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#221DAF]">{username}</h3>
            <p className="text-gray-600">Seu perfil financeiro</p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-[#221DAF] mb-6">
          Área protegida do dashboard!
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h4 className="text-lg font-medium text-[#221DAF] mb-3">Resumo de Gastos</h4>
            <p className="text-gray-700">Confira suas últimas movimentações financeiras!</p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h4 className="text-lg font-medium text-[#221DAF] mb-3">Investimentos</h4>
            <p className="text-gray-700">Acompanhe o desempenho dos seus investimentos!</p>
          </div>
        </div>
      </div>
    </div>
  );
}