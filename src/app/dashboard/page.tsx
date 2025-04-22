'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { authService } from "@/services/authService";

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
     Id: '',
     Email: '',
    UserName: '',
  });
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
          Bem-vindo, <span className="font-extrabold">{userInfo.UserName}</span>!
        </h2>
        <h2 className="text-2xl font-bold text-white">
          Seu E-mail: <span className="font-extrabold">{userInfo.Email}</span>
        </h2>
        <h2 className="text-2xl font-bold text-white">
          Seu Id: <span className="font-extrabold">{userInfo.Id}</span>
        </h2>
      </div>
    </div>
  );
}
