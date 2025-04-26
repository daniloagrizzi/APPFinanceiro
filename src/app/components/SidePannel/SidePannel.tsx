import React from "react";
import ActionButton from "../buttons/ActionButton";
import ProfileCase from "./ProfileCase";


const SidePannel = () => {


    const style = 'bg-dark-purple flex flex-col items-center w-[250px] h-screen place-content-start gap-4'

    return (<>

        <div className={style}> {/* Side Pannel */}
            <div className=" mt-5 "><ProfileCase></ProfileCase></div> {/* Profile*/}
            <div className="w-[90%]  h-[60%]"> {/* Primary Buttons*/}
                <ActionButton text="Dashboard"></ActionButton>
                <ActionButton text="Profile"></ActionButton>
                <ActionButton text="Gastos"></ActionButton>
                <ActionButton text="Rendas"></ActionButton>
                <ActionButton className="mb-5" text="Metas"></ActionButton>
            </div>
            <div className="w-[90%] border-t-1 mb-5"> {/* Other Buttons*/}
                <ActionButton text="Configurações" className="mt-5"></ActionButton>
                <ActionButton text="Sair"></ActionButton>
                <ActionButton text="Ajuda"></ActionButton>
            </div>
        </div >
    </>)





}


export default SidePannel