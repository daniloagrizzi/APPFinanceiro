"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import SidePannel from "../components/SidePannel/SidePannel";
import BigButton from "../components/buttons/BigButton";
import Image from "next/image";
import AlertModal from "../components/UI/AlertModal";

export default function FinancialProfile() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.editarUsuario({
        Email: userInfo.Email,
        UserName: userInfo.UserName,
        ImagemUrl: "", // pode ser tratado futuramente
      });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar informações.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="flex h-screen">
      <SidePannel />

      <div className="w-full flex items-center justify-center bg-white px-8">
        <div className="flex flex-col justify-center w-full max-w-md h-[90vh] text-center shadow-2xl rounded-2xl overflow-hidden">
          {/* user infos */}
          <div className="flex flex-col p-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-md mb-6">
              <img
                src="/ProfilePictures/profile-Icon.jpg"
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-semibold text-dark-purple mb-2">
              Olá, <span className="font-extrabold">{userInfo.UserName}</span>!
            </h1>
            <p className="text-base font-medium text-gray-dark mb-1">
              <span className="font-semibold">Seu e-mail:</span> {userInfo.Email}
            </p>
          </div>

          {/* user info form */}
          <div className="overflow-y-auto px-6 pb-1 mt-3">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 font-semibold text-[#221DAF]"
                >
                  Nome de usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                  placeholder="Digite seu nome de usuário"
                  required
                  value={userInfo.UserName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, UserName: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-semibold text-[#221DAF]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                  placeholder="Digite seu e-mail"
                  required
                  value={userInfo.Email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, Email: e.target.value })
                  }
                />
              </div>

              <div className="mt-4 mb-6">
                <BigButton text={loading ? "Atualizando..." : "Atualizar"} />
              </div>
            </form>
          </div>

          <div className="flex justify-center">
            <Image
              src="/wo-money-blue-big.png"
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showSuccessAlert}
        message="Informações atualizadas com sucesso!"
        onClose={() => setShowSuccessAlert(false)}
      />
    </div>
  );
}
