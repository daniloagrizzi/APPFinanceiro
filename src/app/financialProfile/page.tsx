"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({
    Id: "",
    Email: "",
    UserName: "",
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
          Id: data.Id || data.id,
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
    <div className="flex h-screen">
      <SidePannel></SidePannel> {/* Lado Esquerdo (Perfil do Usuário) */}
      <div className="w-full flex items-center justify-center bg-white px-8">
        
        <div className="w-full h-[90%] max-w-md text-center border-8">{/* Login Case */}
          
          <div className="flex flex-col border-b-2">{/* user info */}
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-md mb-6 mt-6">
              <img
                src="/perfil.jpg"
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-semibold text-dark-purple mb-2">
              Bem-vindo,{" "}
              <span className="font-extrabold">{userInfo.UserName}</span>!
            </h1>
            <p className="text-base font-medium text-gray-dark mb-1">
              <span className="font-semibold">E-mail:</span> {userInfo.Email}
            </p>
            <p className="text-base font-medium text-gray-dark">
              <span className="font-semibold">ID:</span> {userInfo.Id}
            </p>
          </div>  {/* user info */}
          <div>{/* user updates */}
            


          </div>
        </div>
      </div>
    </div>
  );
}
