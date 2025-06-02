import React, { useState, useEffect } from "react";
import ActionButton from "../buttons/ActionButton";
import ProfileCase from "./ProfileCase";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Menu, X } from 'lucide-react';

interface SidePannelProps {
    profilePicture?: string;
    userName?: string;
}

const SidePannel: React.FC<SidePannelProps> = ({
    profilePicture = "/wo-axolot.png",
    userName = "username",
}) => {
    const [realUserName, setRealUserName] = useState<string>(userName);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        closeMobileMenu();
    };

    return (
        <>
            {/* Mobile Menu Button - Visible only on mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="bg-dark-purple text-white p-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

           {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Side Panel */}
            <div className={`
                bg-dark-purple flex flex-col items-center text-white transition-transform duration-300 ease-in-out z-40
                
                /* Desktop styles */
                lg:relative lg:translate-x-0 lg:w-[250px] lg:h-screen
                
                /* Mobile styles */
                fixed top-0 left-0 h-full w-[280px] 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:shadow-none shadow-2xl
            `}>
                {/* Profile Section */}
                <div className="mt-5">
                    <ProfileCase profilePicture={profilePicture} />
                </div>

                {/* Navigation Buttons */}
                <div className="w-[90%] h-[60%] border-t-1 text-white">
                    <ActionButton 
                        onClick={() => handleNavigation('/dashboard')} 
                        icon="Icons/SidePannel/Dashboard.png" 
                        className="mt-2 text-white cursor-pointer" 
                        text="Dashboard" 
                    />
                    <ActionButton 
                        onClick={() => handleNavigation('/financialProfile')} 
                        icon="Icons/SidePannel/User.png" 
                        text="Perfil" 
                        className="text-white mt-2 cursor-pointer" 
                    />
                    <ActionButton 
                        onClick={() => handleNavigation('/Rendas')} 
                        icon="Icons/SidePannel/payments.png" 
                        text="Rendas" 
                        className="text-white mt-2 cursor-pointer" 
                    />
                    <ActionButton 
                        onClick={() => handleNavigation('/Despesas')} 
                        icon="Icons/SidePannel/money_off.png" 
                        text="Despesas" 
                        className="text-white mt-2 cursor-pointer" 
                    />
                    <ActionButton 
                        onClick={() => handleNavigation('/Metas')} 
                        className="mb-5 text-white cursor-pointer" 
                        icon="Icons/SidePannel/savings.png" 
                        text="Metas" 
                    />
                   {/* <ActionButton 
                        onClick={() => handleNavigation('/SorteioDeBitcoin')} 
                        className="mb-5 mt-2 text-white cursor-pointer" 
                        icon="Icons/SidePannel/bitcoin.png" 
                        text="Sorteio de Bitcoin" 
                    /> */}
                </div>

                {/* Logout Button */}
                <div className="w-[90%] border-t-1 mb-5 text-white">
                    <ActionButton 
                        onClick={handleLogout} 
                        text="Sair" 
                        icon="Icons/SidePannel/logout.png" 
                        className="text-white mt-5 cursor-pointer" 
                    />
                </div>
            </div>
        </>
    );
};

export default SidePannel;