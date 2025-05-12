import React from "react";
import ActionButton from "../buttons/ActionButton";
import ProfileCase from "./ProfileCase";
import { useRouter } from "next/navigation";
import { on } from "events";

interface SidePannelProps {
    profilepicture?: string;
    username?: string;
}

const SidePannel: React.FC<SidePannelProps> = ({
    profilepicture = "/Icons/SidePannel/profile-pictst.jpg",
    username = "username",
}) => {
    const style = "bg-dark-purple flex flex-col items-center w-[250px] h-screen gap-4 text-white";
    const router = useRouter();
    return (
        <>
            <div className={style}>
                {/* Side Pannel */}
                <div className="mt-5">
                    <ProfileCase profilePicture={profilepicture} userName={username} />
                </div> {/* Profile */}

                <div className="w-[90%] h-[60%] border-t-1 text-white">
                    {/* Primary Buttons */}
                    <ActionButton onClick={() => router.push('/dashboard')} icon="Icons/SidePannel/Dashboard.png" className="mt-5 text-white" text="Dashboard" />
                    <ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/User.png" text="Perfil" className="text-white" />
                    <ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/trophy-line.png" text="Gastos" className="text-white" />
                    <ActionButton onClick={() => router.push('#')} icon="Icons/SidePannel/flashlight-line.png" text="Rendas" className="text-white" />
                    <ActionButton onClick={() => router.push('#')} className="mb-5 text-white" text="Metas" />
                </div>

                <div className="w-[90%] border-t-1 mb-5 text-white">
                    {/* Other Buttons */}
                    <ActionButton onClick={() => router.push('#')} text="Configurações" className="mt-5 text-white" />
                    <ActionButton onClick={() => router.push('#')} text="Sair" className="text-white" />
                    <ActionButton onClick={() => router.push('#')} text="Ajuda" className="text-white" />
                </div>
            </div>
        </>
    );
};

export default SidePannel;