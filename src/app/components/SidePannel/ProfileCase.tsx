import React, { useState, useEffect } from "react";
import { authService } from "@/services/authService"; 

interface ProfileCase {
    profilePicture?: string;
}

const ProfileCase: React.FC<ProfileCase> = ({ profilePicture = '/perfil.jpg' }) => {
    const [userName, setUserName] = useState<string>(''); 

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const userInfo = await authService.getUserInfo();
                setUserName(userInfo.UserName || userInfo.userName); 
            } catch (error) {
                console.error("Erro ao buscar nome do usuário:", error);
                setUserName("Nome não encontrado");
            }
        };

        fetchUserName();
    }, []); 

    return (
        <figure className="flex-col text-center">
            <img src={profilePicture} className="w-[100px] h-[100px] rounded-full" />
            <figcaption className="m-1"><b>{userName}</b></figcaption>
        </figure>
    );
};

export default ProfileCase;
