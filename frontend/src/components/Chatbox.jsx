import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { searchUser } from '../features/auth/authSlice'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSearch, FaUser } from 'react-icons/fa'
import SearchResult from './SearchResult'
import { getChats } from '../features/messsages/messageSlice'

const Chatbox = () => {
    const dispatch = useDispatch()
    const [value, setValue] = useState('')
    const { receiverId } = useParams()

    const { searchResults, isError, message } = useSelector(state => state.auth)
    const { chats } = useSelector(state => state.message)

    useEffect(() => {
        // Fetch chats when component mounts
        dispatch(getChats())
        console.log(chats)
    }, [dispatch])

    useEffect(() => {
        if (isError) {
            console.error(message)
        }

        if (value.trim().length > 0) {
            dispatch(searchUser({ name: value }))
        }

    }, [value, dispatch, isError, message])

    const onChangeHandler = (e) => {
        e.preventDefault()

        setValue(e.target.value)
    }

    return (
        <div className='fixed left-[24%] h-[100vh] w-1/3 border-r border-white/20 text-white'>
            <div className="sticky top-0 w-full backdrop-blur-lg flex items-center bg-black/50 border-b border-white/20 h-16">
                <Link to="/home">
                    <div className="flex items-center justify-center hover:bg-white/20 w-10 h-10 rounded-full cursor-pointer ml-4">
                        <FaArrowLeft size={17} />
                    </div>
                </Link>
                <h1 className="text-xl font-semibold ml-4">Messages</h1>
            </div>

            <div className="w-[90%] mx-auto mt-6 flex flex-col gap-3">
                {/* Enhanced Search Bar */}
                <div className="relative w-full flex items-center top-4">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name='text'
                        className="text-indent-10 w-full h-10 bg-white/10 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        style={{ textIndent: '40px' }}
                        value={value}
                        onChange={onChangeHandler}
                        placeholder="Search users..."
                    />
                </div>

                <div className="h-6"></div> {/* Spacer instead of margin */}

                {value.trim() ? (
                    // Show search results when searching
                    searchResults.length > 0 ? (
                        <ul className='w-full'>
                            {searchResults
                                .filter((result) =>
                                    result.NAME.toLowerCase().includes(value.toLowerCase())
                                )
                                .map((result, index) => (
                                    <li key={index} className='cursor-pointer'>
                                        <Link to={`/messages/${result.ID}`}>
                                            <SearchResult result={result} />
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className='w-full h-20 flex items-center justify-center'>
                            <p className='text-gray-400'>No users found</p>
                        </div>
                    )
                ) : (
                    // Show chats when not searching
                    chats.length > 0 ? (
                        <ul className='w-full'>
                            {chats.map((chat) => (
                                <li key={chat.user_id} style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: Number(receiverId) === Number(chat.user_id) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                                }} className="hover:bg-white/5">
                                    <Link to={`/messages/${chat.user_id}`} style={{ display: 'block', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '64px', width: '100%' }}>
                                            <div style={{
                                                height: '40px',
                                                width: '40px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(to bottom right, #60a5fa, #a855f7)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '12px',
                                                marginRight: '12px'
                                            }}>
                                                <FaUser className="text-white" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '500' }}>User ID: {chat.user_id}</p>
                                                <div style={{ height: '4px' }}></div>
                                                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Click to view conversation</p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='w-full h-32 flex items-center justify-center'>
                            <p className='text-gray-400'>No messages yet</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Chatbox;
