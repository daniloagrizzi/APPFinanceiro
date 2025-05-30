import React, { useState, useEffect } from "react";
import ActionButton from "../buttons/ActionButton";
import ProfileCase from "./ProfileCase";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService"; 

interface SidePannelProps {
    profilePicture?: string;
    userName?: string;
}

const SidePannel: React.FC<SidePannelProps> = ({
    profilePicture = "/wo-axolot.png",
    userName = "username",
}) => {
    const [realUserName, setRealUserName] = useState<string>(userName);
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const userInfo = await authService.getUserInfo();
                setRealUserName(userInfo.UserName || userInfo.Nome); 
            } catch (error) {
                console.error("Erro ao buscar nome do usuário:", error);
                setRealUserName("Nome não encontrado");
            }
        };

        fetchUserName();
    }, []); 

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    const style = "bg-dark-purple flex flex-col items-center w-[250px] h-screen gap-4 text-white";

    return (
        <>
            <div className={style}>
                {/* Side Pannel */}
                <div className="mt-5">
                    <ProfileCase profilePicture={profilePicture} />
                </div> {/* Profile */}

                <div className="w-[90%] h-[60%] border-t-1 text-white">
                    {/* Primary Buttons */}
                    <ActionButton onClick={() => router.push('/dashboard')} icon="Icons/SidePannel/Dashboard.png" className="mt-2 text-white cursor-pointer" text="Dashboard" />
                    <ActionButton onClick={() => router.push('/financialProfile')} icon="Icons/SidePannel/User.png" text="Perfil" className="text-white mt-2 cursor-pointer" />
                    <ActionButton onClick={() => router.push('/Rendas')} icon="Icons/SidePannel/payments.png" text="Rendas" className="text-white mt-2 cursor-pointer" />
                    <ActionButton onClick={() => router.push('/Despesas')} icon="Icons/SidePannel/money_off.png" text="Despesas" className="text-white mt-2 cursor-pointer" />
                    <ActionButton onClick={() => router.push('/Metas')} className="mb-5 text-white cursor-pointer" icon="Icons/SidePannel/savings.png" text="Metas" />
                    <ActionButton onClick={() => router.push('/SorteioDeBitcoin')} className="mb-5 mt-2 text-white cursor-pointer" icon="Icons/SidePannel/bitcoin.png" text="Sorteio de Bitcoin" />
                </div>

                <div className="w-[90%] border-t-1 mb-5 text-white">
                    {/* Other Buttons */}
                    <ActionButton onClick={handleLogout} text="Sair" icon="Icons/SidePannel/logout.png" className="text-white mt-5 cursor-pointer" />
                </div>
            </div>
        </>
    );
};


export default SidePannel;
