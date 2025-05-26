import React from "react"
import { ButtonProps } from "@/app/types/ButtonProps"


const BigButton: React.FC<ButtonProps> = ({ text, onClick, type, className, variant = 'default' }) => {
    const baseStyles = "w-full mt-4 font-semibold rounded-full py-3 transition";

    const defaultStyles = "bg-dark-purple text-white ring-dark-purple hover:bg-light-purple cursor-pointer";
    const alternativeStyles = "bg-white text-dark-purple ring-dark-purple hover:text-light-purple ring-2 hover:ring-light-purple";

    const finalStyles = `${baseStyles} ${variant === "secundary" ? alternativeStyles : defaultStyles} ${className || ""}`;

    return (
        <button type={type} className={finalStyles} onClick={onClick} >
            {text}
        </button >
    )
}

export default BigButton




