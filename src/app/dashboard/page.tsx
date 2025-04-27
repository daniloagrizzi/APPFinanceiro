'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";



export default function Dashboard() {
  /*  const [isAuth, setIsAuth] = useState(false);
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
 
   if (!isAuth) return null; */

  return (

    <div className="flex h-screen">
      <SidePannel></SidePannel>    {/* Lado Esquerdo (Perfil do Usuário) */}
      <div className="w-full lg:w-screen flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-h1 font-bold text-dark-purple mb-10">Wo! Money</h1>
          <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-md mb-6">
            <img src="/perfil.jpg" alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-semibold text-dark-purple mb-2">
            Bem-vindo, <span className="font-extrabold">{/* userInfo.UserName */}</span>!
          </h2>
          <p className="text-base font-medium text-gray-dark mb-1">
            <span className="font-semibold">E-mail:</span> {/* userInfo.Email */}
          </p>
          <p className="text-base font-medium text-gray-dark">
            <span className="font-semibold">ID:</span> {/* userInfo.Id */}
          </p>
        </div>
      </div>
    </div>
  );
}
