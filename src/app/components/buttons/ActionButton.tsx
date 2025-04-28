import React from "react";
import { ButtonProps } from "@/app/types/ButtonProps";



const ActionButton: React.FC<ButtonProps> = ({ type = 'button', className, text = 'text', onClick, icon = '/wo-axolot.png' }) => {

    //Icon Styles
    const IconStyle = 'w-[24px]  m-3'

    const ButtonSizes = 'h-[4rem] w-[100%]'

    const ButtonStyle = `${className} flex items-center justify-center bg-dark-purple hover:bg-light-purple ${ButtonSizes} `


    return (

        <>
            <button type={type} className={ButtonStyle} onClick={onClick}>
                <img src={icon} alt="Action button icon" className={IconStyle} />
                <span className="flex-1 text-start m-4"><b>{text}</b></span>
            </button>

        </>



    )
}

export default ActionButton