import React from "react";
import { ButtonProps } from "@/app/types/ButtonProps";



const ActionButton: React.FC<ButtonProps> = ({type,className,text ='label',onClick,icon='/wo-axolot.png'}) => {


const SMicon = 'w-[24px] h-[24px] object-left m-[5px]'
const SMstyles ='h-[32px] w-[80px] bg-dark-purple rounded-[0.625rem] flex items-center hover:bg-light-purple'

return(

<>
<button className={SMstyles}>
<div>
<img src={icon} alt="Action button icon" className={SMicon} />
</div>
<div className="m-[5px]">
{text}
</div>
</button>
</>

)
}

export default ActionButton