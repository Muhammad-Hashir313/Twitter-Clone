import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { searchUser } from '../features/auth/authSlice'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSearch, FaUser, FaComments } from 'react-icons/fa'
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

        return isOnline;
    };

    return (
        <div className='fixed left-[24%] h-[100vh] w-1/3 bg-black text-white'>
            {/* Glassmorphism border effect */}
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"></div>

            {/* Header with glassmorphism effect */}
            <div className="sticky top-0 w-full backdrop-blur-lg bg-black/50 border-b border-white/10">
                <div className="h-4"></div>
                <div className="flex items-center">
                    <div className="w-4"></div>
                    <Link to="/home">
                        <div className="flex items-center justify-center hover:bg-white/10 transition-all duration-300 w-10 h-10 rounded-full cursor-pointer group">
                            <FaArrowLeft size={17} className="group-hover:scale-110 transition-transform duration-200" />
                        </div>
                    </Link>
                    <div className="w-4"></div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Messages
                    </h1>
                    <div className="flex-1"></div>
                    <div className="w-4"></div>
                </div>
                <div className="h-4"></div>
            </div>

            {/* Content Area */}
            <div className="h-full overflow-y-auto">
                <div className="h-6"></div>

                {/* Enhanced Search Bar with gradient border */}
                <div style={{ marginLeft: '16px', marginRight: '16px' }}>
                    <div className="relative">
                        {/* Gradient border effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-sm"></div>

                        <div className="relative flex bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm focus-within:border-blue-500/50 focus-within:bg-gray-900/80 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="w-4"></div>
                                <FaSearch className="text-gray-400" />
                                <div className="w-3"></div>
                            </div>
                            <input
                                type="text"
                                name='text'
                                className="flex-1 bg-transparent text-gray-200 outline-none placeholder-gray-500"
                                style={{ paddingTop: '12px', paddingBottom: '12px' }}
                                value={value}
                                onChange={onChangeHandler}
                                placeholder="Search users..."
                            />
                            <div className="w-4"></div>
                        </div>
                    </div>
                </div>

                <div className="h-6"></div>

                {/* Content based on search state */}
                <div style={{ marginLeft: '16px', marginRight: '16px' }}>
                    {value.trim() ? (
                        // Show search results when searching
                        searchResults.length > 0 ? (
                            <div className='w-full space-y-2'>
                                {searchResults
                                    .filter((result) =>
                                        result.NAME.toLowerCase().includes(value.toLowerCase())
                                    )
                                    .map((result, index) => (
                                        <div key={index}
                                            className='cursor-pointer group'
                                            onClick={() => handleSearchResultClick(result.ID)}>
                                            <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300 group-hover:scale-[1.02]">
                                                <SearchResult result={result} />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className='w-full flex items-center justify-center'>
                                <div className="h-20"></div>
                                <div className="text-center">
                                    <FaSearch className="text-gray-600 text-2xl mx-auto" />
                                    <div className="h-3"></div>
                                    <p className='text-gray-400'>No users found</p>
                                </div>
                            </div>
                        )
                    ) : (
                        // Show chats when not searching
                        chats.length > 0 ? (
                            <div className='w-full space-y-2'>
                                {chats.map((chat) => (
                                    <div key={chat.user_id} className="group">
                                        <Link to={`/messages/${chat.user_id}`}>
                                            <div className={`
                                                relative rounded-xl border transition-all duration-300 cursor-pointer group-hover:scale-[1.02]
                                                ${Number(receiverId) === Number(chat.user_id)
                                                    ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                                                    : 'bg-gray-900/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50'
                                                }
                                            `}>
                                                {/* Subtle glow effect for active chat */}
                                                {Number(receiverId) === Number(chat.user_id) && (
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-sm"></div>
                                                )}

                                                <div className="relative flex items-center">
                                                    <div className="h-4"></div>
                                                    <div className="w-4"></div>

                                                    {/* Avatar with online indicator */}
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                                                            <FaUser className="text-white text-lg" />
                                                        </div>
                                                        {/* Enhanced online status indicator */}
                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black transition-all duration-300 ${isUserOnline(chat.user_id)
                                                            ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                                            : 'bg-gray-500'
                                                            }`}>
                                                            {isUserOnline(chat.user_id) && (
                                                                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="w-4"></div>

                                                    {/* User info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                                                                {chat.NAME}
                                                            </p>
                                                            <span className={`text-xs font-medium transition-colors duration-200 ${isUserOnline(chat.user_id)
                                                                ? 'text-green-400'
                                                                : 'text-gray-500'
                                                                }`}>
                                                                {isUserOnline(chat.user_id) ? 'Online' : 'Offline'}
                                                            </span>
                                                        </div>
                                                        <div className="h-1"></div>
                                                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-200">
                                                            Click to view conversation
                                                        </p>
                                                    </div>

                                                    <div className="w-4"></div>
                                                    <div className="h-4"></div>
                                                </div>
                                                <div className="h-4"></div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='w-full flex items-center justify-center'>
                                <div className="h-32"></div>
                                <div className="text-center space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto">
                                            <FaComments className="text-gray-500 text-2xl" />
                                        </div>
                                        <div className="absolute inset-0 bg-gray-600/20 rounded-full blur-xl"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-300">No conversations yet</h3>
                                        <div className="h-1"></div>
                                        <p className='text-gray-500 text-sm'>Search for users to start chatting</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="h-20"></div> {/* Bottom spacer */}
            </div>
        </div>
    )
}

export default Chatbox;