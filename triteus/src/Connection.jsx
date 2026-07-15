import Disconnected from './assets/Disconnected.png'
import Empty from './assets/Empty.png'
import Full from './assets/Full.png'
import Half from './assets/Half.png'

function Connection(){

    function GetIconForStrength(value) {
        if (value == -1) {
            return Disconnected
        } else if (value >= 0.01 && value < 0.3) {
            return Empty
        } else if (value >= 0.3 && value < 0.65) {
            return Half
        } else if (value >= 0.65) {
            return Full
        }
    }

    return(
        <div className='h-full flex flex-col items-center gap-y-0 py-3 justify-end'>
         <img src={GetIconForStrength(0.2)} alt="" className='h-full'/>
         <span className='text-indigo-50 text-sm'>CONNECTION</span>
        </div>
    )
}

export default Connection