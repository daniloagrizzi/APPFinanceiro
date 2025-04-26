import React from "react";
import { ButtonProps } from "@/app/types/ButtonProps";



const ActionButton: React.FC<ButtonProps> = ({ type = 'button', className, text = 'text', onClick, icon = '/wo-axolot.png' }) => {

    //Icon Styles
    const IconStyle = 'w-[24px] h-[24px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px] xl:w-[32px] xl:h-[32px] 2xl:w-[36px] 2xl:h-[36px] object-contain m-3'
    // Default Style for all Devices

    const ButtonSizes = 'h-[2rem] w-[100%] sm:h-[2rem]  md:h-[2.5rem]  lg:h-[3rem]  xl:h-[3.5rem]  2xl:h-[4rem] rounded-[0.625rem]'


    const ButtonStyle = `${className} flex items-center justify-center bg-dark-purple hover:bg-light-purple ${ButtonSizes} `


    return (

        <>
            <button type={type} className={ButtonStyle} onClick={onClick}>
                <img src={icon} alt="Action button icon" className={IconStyle} />
                <span className=" flex-1 text-start m-4"><b>{text}</b></span>
            </button>

        </>



    )
}

export default ActionButton