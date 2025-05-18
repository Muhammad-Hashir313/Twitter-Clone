import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { searchUser } from '../features/auth/authSlice'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import SearchResult from './SearchResult'


const Chatbox = () => {
    const dispatch = useDispatch()

    const [value, setValue] = useState('')

    const { searchResults, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (isError) {
            console.error(message)
        }

        if (value.trim().length > 0) {
            dispatch(searchUser({ name: value }))
        }

    }, [value])

    const onChangeHandler = (e) => {
        e.preventDefault()

        setValue(e.target.value)
    }

    return (
        <div className='fixed left-[24%] h-[100vh] w-1/3 border-r border-white/20 text-white'>
            <div className="sticky w-112 backdrop-blur-lg flex gap-1 items-center bg-black/50 border-b border-white/20">
                <Link to="/home">
                    <div className="flex items-center justify-center hover:bg-white/20 w-10 h-10 rounded-full cursor-pointer">
                        <FaArrowLeft size={17} />
                    </div>
                </Link>
                <h1 className="text-xl font-semibold ml-4">Messages</h1>
            </div>

            <div className="relative top-4 left-[5%] text-white flex flex-col gap-3">
                <input
                    type="text"
                    name='text'
                    className="w-100 h-8 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={value}
                    onChange={onChangeHandler}
                />
                {
                    value && searchResults.length > 0 ? (
                        <ul className='relative top-2'>
                            {value && searchResults
                                .filter((result) =>
                                    result.NAME.toLowerCase().includes(value.toLowerCase())
                                )
                                .map((result, index) => (
                                    <li key={index} className='cursor-pointer'>
                                        <Link to={`/profile/${result.NAME.toLowerCase()}`}>
                                            <SearchResult result={result} />
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className='text-gray-400'>Nothing to show</p>
                    )
                }
            </div>
        </div>
    )
}

export default Chatbox;
