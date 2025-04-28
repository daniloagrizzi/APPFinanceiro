import React from "react";
import { CardsProps } from "@/app/types/CardsProps";
import ItemCard from "./ItemCard.tsx/ItemCard";
import ItemButton from "../buttons/ItemButton";



const BillsCard: React.FC<CardsProps> = ({ cardName = '{cardname}' }) => {


    return (<>
        <div className="bg-light-gray flex h-[90%] w-[300px] justify-center items-center rounded-2xl">
            <article className="flex h-[90%] w-[90%] flex-col gap-1">
                <header className="text-dark-purple text-h3 h-[10%] ">
                    <h3 className="flex flex-row place-content-between items-center">
                        <b className="">{cardName}</b>
                        <ItemButton variant="default" className="bg-white border-white " icon="/Icons/Cards/add.png" IconStyle="w-[32px] h-[32px]"></ItemButton>
                    </h3>
                </header>
                <ul className="flex flex-col h-[90%] gap-1">
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                    <ItemCard></ItemCard>
                </ul>
            </article>
        </div>
    </>)



}


export default BillsCard