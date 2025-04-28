import React from "react";
import { ButtonProps } from "@/app/types/ButtonProps";



const ItemButton: React.FC<ButtonProps> = ({ type = 'button', className, onClick, icon = '', alt = 'button', variant = 'default', IconStyle = 'w-[16px] h-[16px]', Sizes = '' }) => {



    //Icon Styles


    const ButtonSizes = Sizes

    const ButtonPurple = `${className} ${ButtonSizes} border-8 border-dark-purple bg-dark-purple  flex justify-center items-center hover:bg-light-purple hover:border-light-purple rounded-[0.625rem]  `

    const ButtonRed = `${className} border-8 border-negative-red bg-negative-red hover:border-alternative-red  hover:bg-alternative-red flex justify-center items-center rounded-[0.625rem] ${ButtonSizes} `

    const finalStyles = ` ${className || ""} ${variant === "secundary" ? ButtonRed : ButtonPurple} `



    return (

        <>
            <button type={type} className={finalStyles} onClick={onClick}>
                <img src={icon} className={IconStyle} alt={alt} />
            </button>

        </>



    )
}

export default ItemButton