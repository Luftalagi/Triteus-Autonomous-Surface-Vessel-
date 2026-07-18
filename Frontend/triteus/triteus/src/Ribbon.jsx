import { Save , ChevronDown, Cog, CornerUpLeft, CornerUpRight} from "lucide-react"
import Connection from './Connection'

import DrawLines from "./assets/DrawLines.png"
function Ribbon() {
    return(
        <>
        <div className="bg-[#10161f] h-[35px] padding px-5 flex">
            <button className="flex items-center gap-1 px-2 hover:bg-[#3a4454]">
              <Save  color="#fff" size={22}/>
              <ChevronDown color="#fff" size={12}/>
            </button>

            <button className="flex items-center gap-1 px-2 hover:bg-[#3a4454]">
                <CornerUpLeft color="#fff" size={22}/>
                 <ChevronDown color="#fff" size={12}/>
            </button>

            <button className="flex items-center gap-1 px-2 hover:bg-[#3a4454]">
                <CornerUpRight color="#fff" size={22}/>
                <ChevronDown color="#fff" size={12}/>
            </button>

            <button className="ml-auto px-2 hover:bg-[#3a4454]">
                <Cog color="#fff" size={22}/>
            </button>
        </div>
        <div className="w-screen bg-[#3a4454] flex items-center mr-1 h-[100px] gap-5 pl-5">
            <Connection/>
            <div className="w-[2px] h-20 bg-white/20"/>
            <div className="h-full flex flex-col items-center justify-end gap-y-1 py-3">
                <button className="h-12 flex items-center justify-center">
                    <img src={DrawLines} alt="" className="h-full" />
                </button>
                <span className='text-indigo-50 text-sm'>MOVEMENT</span>
            </div>
            <div className="w-[2px] h-20 bg-white/20"/>
        </div>
        
        </>
    )
}

export default Ribbon