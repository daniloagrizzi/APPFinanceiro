import React from "react";
import { ButtonProps } from "@/app/types/ButtonProps";



const ActionButton: React.FC<ButtonProps> = ({type,className,text ='label',onClick,icon='/wo-axolot.png'}) => {

    //Icon Styles
const IconStyle = 'w-[24px] h-[24px] object-left m-[5px]' // Default Style for all Devices

const ButtonSizes = 'sm:h-[32px] sm:w-[80px] md:h-[36px] md:w-[100px] lg:h-[40px] lg:w-[120px] xl:w-[44px] xl:w-[140px] 2xl:h-[48px] 2xl:w-[160px]  rounded-[0.625rem]'
const ButtonStyle =`flex bg-dark-purple hover:bg-light-purple ${ButtonSizes}`


return(

<>
<button className={ButtonStyle}>
<div>
<img src={icon} alt="Action button icon" className={IconStyle} />
</div>
<div className="flex items-center m-[20px]">
    <label>{text}</label>
</div>
</button>
</>

)
}

export default ActionButton