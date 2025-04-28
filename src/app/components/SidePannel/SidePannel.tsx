"use client"
import React from "react";
import ActionButton from "../buttons/ActionButton";
import ProfileCase from "./ProfileCase";
import { useRouter } from "next/navigation";


interface SidePannelProps {
    profilepicture?: string;
    username?: string;


}

const SidePannel: React.FC<SidePannelProps> = ({
    profilepicture = "/Icons/SidePannel/profile-pictst.jpg",
    username = "username",
}) => {


    const style = "bg-dark-purple flex flex-col items-center w-[250px] h-screen gap-4";
    const router = useRouter();
    return (
        <>
            <div className={style}>
                {/* Side Pannel */}
                <div className="mt-5">
                    <ProfileCase profilePicture={profilepicture} userName={username} />
                </div> {/* Profile */}

                <div className="w-[90%] h-[60%] border-t-1">
                    {/* Primary Buttons */}
                    <ActionButton onClick={() => router.push('/dashboard')} icon="Icons/SidePannel/Dashboard.png" className="mt-5" text="Dashboard" />
                    < ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/User.png" text="Perfil" />
                    <ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/trophy-line.png" text="Gastos" />
                    <ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/flashlight-line.png" text="Rendas" />
                    <ActionButton onClick={() => router.push('#')} className="mb-5" text="Metas" />
                </div>

                <div className="w-[90%] border-t-1 mb-5">
                    {/* Other Buttons */}
                    <ActionButton onClick={() => router.push('#')} text="Configurações" className="mt-5" />
                    <ActionButton onClick={() => router.push('#')} text="Sair" />
                    <ActionButton onClick={() => router.push('#')} text="Ajuda" />
                </div>
            </div>
        </>
    );
};

export default SidePannel;
