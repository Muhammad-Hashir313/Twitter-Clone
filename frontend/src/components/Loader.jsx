import React from 'react'
import WhiteLogo from '../../x-logo/WhiteLogo.png'

const Loader = () => {
    return (
        <div className='relative top-65 -left-5 flex flex-col items-center'>
            <img className='w-10' src={WhiteLogo} alt="Loading..." />
        </div>
    )
}

export default Loader