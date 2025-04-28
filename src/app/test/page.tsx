import ActionButton from "../components/buttons/ActionButton"
import BillsCard from "../components/cards/BillsCard"
import SidePannel from "../components/SidePannel/SidePannel"



export default function () {


    return (

        <>
            <div className="flex flex-row bg-white gap-5">
                <div className="">
                    <SidePannel></SidePannel >
                </div>
                <div className="flex justify-center items-center justify-start w-full ">
                    <BillsCard></BillsCard>
                </div>
            </div>
        </>


    )


}