import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { searchUser } from '../features/auth/authSlice'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSearch, FaUser } from 'react-icons/fa'
import SearchResult from './SearchResult'
import { getChats } from '../features/messsages/messageSlice'
import socket from './Socket'

const Chatbox = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [value, setValue] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([])
    const { receiverId } = useParams()

    const { searchResults, isError, message } = useSelector(state => state.auth)
    const { chats } = useSelector(state => state.message)

    useEffect(() => {
        // Fetch chats when component mounts
        dispatch(getChats())
    }, [dispatch])

    // Improved setup for socket listeners for real-time chat updates and online status
    useEffect(() => {
        console.log("Setting up socket listeners for Chatbox");

        // Handler for new chat notification
        const handleNewChat = ({ users }) => {
            console.log('New chat between users:', users);
            // Refresh the chat list to show new conversations
            dispatch(getChats());
        };

        // Handler for receiving online users list from Redis
        const handleOnlineUsers = (users) => {
            console.log("Online users received in Chatbox from Redis:", users);
            setOnlineUsers(users || []);
        };

        // Handler for user status updates
        const handleUserStatus = ({ userId, status }) => {
            console.log(`User ${userId} is now ${status}`);

            setOnlineUsers(prev => {
                if (status === 'online' && !prev.includes(userId)) {
                    return [...prev, userId];
                } else if (status === 'offline') {
                    return prev.filter(id => id !== userId);
                }
                return prev;
            });
        };

        // Setup all socket event listeners
        socket.on('newChat', handleNewChat);
        socket.on('onlineUsers', handleOnlineUsers);
        socket.on('userStatus', handleUserStatus);

        // Force request online users list
        if (socket.connected) {
            console.log("Already connected in Chatbox - requesting online users");
            socket.emit('getOnlineUsers');
        } else {
            console.log("Socket not connected in Chatbox");
            // The connection will be established by MessageList component
        }

        return () => {
            // Clean up all listeners
            socket.off('newChat', handleNewChat);
            socket.off('onlineUsers', handleOnlineUsers);
            socket.off('userStatus', handleUserStatus);
        };
    }, [dispatch]);

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

    // Handle search result click
    const handleSearchResultClick = (userId) => {
        // Clear search input when a user is selected
        setValue('');
        // Navigate to the chat with that user
        navigate(`/messages/${userId}`);
    };

    // Enhanced check if a user is online with debugging
    const isUserOnline = (userId) => {
        const isOnline = onlineUsers.includes(Number(userId));
        console.log(`Chatbox checking if user ${userId} is online:`, isOnline,
            "Online users in Chatbox:", onlineUsers);
        return isOnline;
    };

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
                                    <li key={index} className='cursor-pointer' onClick={() => handleSearchResultClick(result.ID)}>
                                        <div className="hover:bg-white/5 w-full">
                                            <SearchResult result={result} />
                                        </div>
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
                                            <div className="relative" style={{
                                                marginLeft: '12px',
                                                marginRight: '12px'
                                            }}>
                                                <div style={{
                                                    height: '40px',
                                                    width: '40px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(to bottom right, #60a5fa, #a855f7)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <FaUser className="text-white" />
                                                </div>
                                                {/* Online status indicator */}
                                                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-black ${isUserOnline(chat.user_id) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p style={{ fontWeight: '500' }}>User ID: {chat.user_id}</p>
                                                    <span className={`text-xs ${isUserOnline(chat.user_id) ? 'text-green-500' : 'text-gray-500'}`}>
                                                        {isUserOnline(chat.user_id) ? 'Online' : 'Offline'}
                                                    </span>
                                                </div>
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
