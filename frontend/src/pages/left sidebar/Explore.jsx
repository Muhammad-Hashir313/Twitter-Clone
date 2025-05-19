import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUser } from '../../features/auth/authSlice'
import LeftSidebar from './LeftSidebar'
import { Link } from 'react-router-dom'
import SearchResult from '../../components/SearchResult'
// import RightSidebar from '../right sidebar/RightSidebar'

const Explore = () => {
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
        <div>
            <LeftSidebar />
            <div className="relative top-4 left-[25%] text-white">
                <input
                    type="text"
                    name='text'
                    className="w-159 h-8 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={value}
                    onChange={onChangeHandler}
                />
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
            </div>
        </div>
    )
}

export default Explore