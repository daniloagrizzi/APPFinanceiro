import React from "react";
import ItemButton from "../../buttons/ItemButton";


interface ItemCard {

    ItemType?: string;
    ItemName?: string;
    ItemValue?: number;


}



const ItemCard: React.FC<ItemCard> = ({ ItemName = '{ItemName}', ItemValue = '{ItemValue}' }, ItemType = 'Icons/Cards/receipt.png') => {





    return (
        <>
            <li className="flex flex-row w-full items-center justify-center gap-3 m-1" >
                {/* Type Image */}
                <div className="bg-white h-auto w-auto flex justify-center border-white rounded-[0.625rem] border-8">
                    <img src={ItemType} alt="Item Type" className="w-[24px] h-[24px]" />
                </div>
                {/* item Description */}
                <div className="flex flex-row gap-1 text-center items-center justify-center">
                    <p className="text-center">
                        <span className="text-black">${ItemValue}</span>
                        <br />
                        <span className="text-dark-gray">{ItemName}</span>
                    </p>
                </div>
                <div className="flex flex-row gap-[5px] justify-center items-center h-full ">
                    {/* buttons */}
                    <ItemButton variant="default" alt="Edit Button" icon="/Icons/Cards/edit1.png" type="button" IconStyle="w-[24px] h-[24px]"></ItemButton>
                    <ItemButton variant="secundary" alt="Remove Button" icon="/Icons/Cards/delete.png" type="button" IconStyle="w-[24px] h-[24px]"></ItemButton>

                </div>
            </li>
        </>)


}

export default ItemCard