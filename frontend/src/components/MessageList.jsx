import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages, sendMessage } from '../features/messsages/messageSlice';
import { FaUser, FaPaperPlane, FaComments } from 'react-icons/fa';
import socket from './Socket';
import { getUser } from '../features/auth/authSlice';

const MessageList = () => {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [localMessages, setLocalMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(socket.connected);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { receiverId } = useParams();
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const currentChatRef = useRef(null);

    const { messages, isLoading } = useSelector(state => state.message);
    const { name, user } = useSelector(state => state.auth);

    // Function to scroll to bottom of messages instantly
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }

    // Enhanced setup for socket connection status monitoring and online users tracking
    useEffect(() => {
        // Log socket connection status

        const onConnect = () => {
            setSocketConnected(true);

            // Request online users list immediately after connecting
            socket.emit('getOnlineUsers');
        };

        const onDisconnect = () => {
            setSocketConnected(false);
        };

        // Handler for receiving online users list - this is now from Redis
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users || []);
        };

        // Handler for user status updates
        const handleUserStatus = ({ userId, status }) => {

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
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('onlineUsers', handleOnlineUsers);
        socket.on('userStatus', handleUserStatus);

        // Force request online users list on component mount
        if (socket.connected) {
            socket.emit('getOnlineUsers');
        } else {
            socket.connect();
        }

        // Debug registered listeners
        socket.hasListeners('onlineUsers');

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('onlineUsers', handleOnlineUsers);
            socket.off('userStatus', handleUserStatus);
        };
    }, []);

    // Reset messages when receiverId changes or user changes
    useEffect(() => {
        // Clear local messages when changing conversations
        setLocalMessages([]);
        currentChatRef.current = receiverId;

    }, [receiverId, user?.id]);

    // Update local messages when redux messages change
    useEffect(() => {
        // Only update if this is for the current conversation
        if (messages && messages.length > 0 && receiverId === currentChatRef.current) {

            // Replace messages completely instead of merging to ensure clean state
            setLocalMessages(messages);
        }
    }, [messages, receiverId]);

    // Set up socket listeners for real-time messages
    useEffect(() => {

        // Define the message handler
        const handleNewMessage = (data) => {

            // Only add to current chat if it's from the current conversation
            const isCurrentConversation =
                (data.senderId === Number(receiverId) && data.receiverId === user.id) ||
                (data.senderId === user.id && data.receiverId === Number(receiverId));

            if (isCurrentConversation && receiverId === currentChatRef.current) {

                // Create message object that matches our expected format
                const newMsg = {
                    ID: data.id || `temp-${Date.now()}`,
                    SENDER_ID: data.senderId,
                    RECEIVER_ID: data.receiverId,
                    MESSAGE: data.message,
                    CREATED_AT: data.createdAt || new Date().toISOString()
                };

                // Add to local messages
                setLocalMessages(prevMessages => {
                    // Prevent duplicate messages with more comprehensive checking
                    const isDuplicate = prevMessages.some(msg =>
                        // Check by ID if available
                        (msg.ID === newMsg.ID && newMsg.ID !== undefined) ||
                        // Check by content + sender + rough timestamp (within 2 seconds)
                        (msg.SENDER_ID === newMsg.SENDER_ID &&
                            msg.MESSAGE === newMsg.MESSAGE &&
                            Math.abs(new Date(msg.CREATED_AT) - new Date(newMsg.CREATED_AT)) < 2000)
                    );

                    if (isDuplicate) {
                        console.log("Message is a duplicate, not adding");
                        return prevMessages;
                    }

                    return [...prevMessages, newMsg];
                });

                // Scroll to bottom on new message
                setTimeout(scrollToBottom, 50);
            } else {
                console.log("Message is not for current conversation or receiver has changed");
            }
        };

        // Remove any existing listeners to prevent duplicates
        socket.off('receiveMessage');

        // Add new listener
        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [receiverId, user?.id]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    useEffect(() => {
        if (receiverId && user?.id) {

            // Set current conversation
            currentChatRef.current = receiverId;

            // Join a conversation room
            socket.emit('joinRoom', { userId: user.id, receiverId: Number(receiverId) });

            // Clear old messages and load new ones
            dispatch(getMessages(receiverId))
                .then(() => {
                    // Scroll to bottom after messages are loaded
                    setTimeout(scrollToBottom, 50);
                });
            dispatch(getUser({ id: receiverId }))
            console.log(name)

            // Clean up when leaving the conversation
            return () => {
                socket.emit('leaveRoom', { userId: user.id, receiverId: Number(receiverId) });
            };
        }
    }, [dispatch, receiverId, user?.id]);

    // Handle sending a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && receiverId === currentChatRef.current) {
            setIsSending(true); // Set sending state to true

            // Clear input right away for better UX
            const messageToSend = newMessage.trim();
            setNewMessage('');


            // Generate a consistent ID for this message to help with deduplication
            const tempMessageId = `temp-${Date.now()}`;

            // Create a message object for local display
            const messageObject = {
                ID: tempMessageId,
                SENDER_ID: user.id,
                RECEIVER_ID: Number(receiverId),
                MESSAGE: messageToSend,
                CREATED_AT: new Date().toISOString()
            };

            // Add to local messages immediately for instant display
            setLocalMessages(prevMessages => [...prevMessages, messageObject]);

            // Emit the message via socket for real-time delivery
            socket.emit('sendMessage', {
                id: tempMessageId, // Include temp ID to help with deduplication
                senderId: user.id,
                receiverId: Number(receiverId),
                message: messageToSend,
                createdAt: messageObject.CREATED_AT
            });


            // Scroll to bottom immediately
            scrollToBottom();

            // Also send via API for persistence (backend should prevent duplication)
            dispatch(sendMessage({
                id: receiverId,
                message: { message: messageToSend, tempId: tempMessageId }
            })).then(() => {
                setIsSending(false);

                // Don't reload messages from API to prevent duplicates
                // The socket will handle real-time updates
            }).catch(error => {
                console.error("Error sending message:", error);
                setIsSending(false);
            });
        }
    };

    // Check if a user is online - include debug info
    const isUserOnline = (userId) => {
        const isOnline = onlineUsers.includes(Number(userId));
        "Online users:", onlineUsers;
        return isOnline;
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    if (!receiverId) {
        return (
            <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex justify-center items-center bg-black text-white">
                {/* Glassmorphism border effect */}
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"></div>

                {/* Connection status indicator positioned absolutely */}
                <div className={`absolute top-4 right-4 h-3 w-3 rounded-full ${socketConnected ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'} transition-all duration-300`}
                    title={socketConnected ? 'Connected' : 'Disconnected'}>
                    {socketConnected && (
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                </div>

                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="relative left-[38%] -top-5 w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <FaComments className="text-gray-500 text-3xl" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full blur-xl"></div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Select a conversation</h2>
                        <p className="text-gray-400 max-w-md">Choose a user from the left to start messaging and see your chat history</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex flex-col bg-black text-white">
            {/* Glassmorphism border effect */}
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"></div>

            {/* Connection status indicator */}
            <div className={`absolute top-4 right-4 h-3 w-3 rounded-full z-10 ${socketConnected ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'} transition-all duration-300`}
                title={socketConnected ? 'Connected' : 'Disconnected'}>
                {socketConnected && (
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                )}
            </div>

            {/* Enhanced Chat header with glassmorphism */}
            <div className="flex-shrink-0 backdrop-blur-lg bg-black/50 border-b border-white/10">
                <div className="h-4"></div>
                <div className="flex items-center">
                    <div className="w-4"></div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <FaUser className="text-white text-xl" />
                            </div>
                            {/* Enhanced Online/Offline indicator */}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black transition-all duration-300 ${isUserOnline(receiverId)
                                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                : 'bg-gray-500'
                                }`}>
                                {isUserOnline(receiverId) && (
                                    <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    {name?.NAME}
                                </h2>
                                <span className={`text-xs font-medium transition-colors duration-200 ${isUserOnline(receiverId) ? 'text-green-400' : 'text-gray-500'
                                    }`}>
                                    {isUserOnline(receiverId) ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">@{name?.NAME}</p>
                        </div>
                    </div>
                    <div className="w-4"></div>
                </div>
                <div className="h-4"></div>
            </div>

            {/* Messages area with custom scrollbar */}
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" ref={messagesContainerRef}>
                <div className="h-4"></div>

                {isLoading && !isSending && localMessages.length === 0 ? (
                    <div className="text-center">
                        <div className="h-32"></div>
                        <div className="space-y-4">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-400">Loading messages...</p>
                        </div>
                    </div>
                ) : localMessages.length > 0 ? (
                    <div className="space-y-4">
                        <div className="pl-4 pr-4">
                            {localMessages.map((message, idx) => (
                                <div key={message.ID || message.id || idx} className="group">
                                    <div className="flex gap-4 w-full">
                                        {/* Avatar */}
                                        {message.SENDER_ID !== user.id && (
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800 group-hover:ring-green-500/50 transition-all duration-300">
                                                    <FaUser className="text-white text-sm" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Message content */}
                                        <div className={`flex-1 min-w-0 ${message.SENDER_ID === user.id ? 'flex justify-end' : ''}`}>
                                            <div className={`max-w-[75%] ${message.SENDER_ID === user.id ? 'order-2' : ''}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-sm font-semibold ${message.SENDER_ID === user.id ? 'text-blue-400' : 'text-green-400'
                                                        }`}>
                                                        {message.SENDER_ID === user.id ? 'You' : `User ${receiverId}`}
                                                    </span>
                                                    <span className="text-gray-600 text-xs">
                                                        {new Date(message.CREATED_AT).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className={`rounded-2xl border transition-all duration-300 group-hover:border-opacity-60 ${message.SENDER_ID === user.id
                                                    ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 group-hover:border-blue-500/40'
                                                    : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 group-hover:border-gray-600/50'
                                                    }`}>
                                                    <div className="px-4 py-3">
                                                        <p className="text-gray-200 leading-relaxed break-words">
                                                            {message.MESSAGE}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Avatar for sent messages */}
                                        {message.SENDER_ID === user.id && (
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800 group-hover:ring-blue-500/50 transition-all duration-300">
                                                    <FaUser className="text-white text-sm" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="h-6"></div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                                    <FaComments className="text-gray-500 text-3xl" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full blur-xl"></div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">
                                    Start the conversation
                                </h3>
                                <p className="text-gray-400 max-w-md">
                                    No messages yet. Send a message to begin chatting with User {receiverId}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/80 backdrop-blur-sm">
                <div className="h-4"></div>
                <div className="w-full max-w-4xl mx-auto">
                    <div className="pl-4 pr-4">
                        <div className="relative">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-sm"></div>

                            <div className="relative flex bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm focus-within:border-blue-500/50 focus-within:bg-gray-900/80 transition-all duration-300">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-4"></div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaUser className="text-white text-xs" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Type your message... (Press Enter to send)"
                                        className="flex-1 bg-transparent text-gray-200 outline-none placeholder-gray-500 py-4"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        disabled={isSending}
                                    />
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending || !newMessage.trim() || !socketConnected}
                                    className={`
                                        flex items-center justify-center transition-all duration-300 transform m-2 w-14 h-14 rounded-2xl
                                        ${isSending || !newMessage.trim() || !socketConnected
                                            ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                                        }
                                    `}
                                >
                                    {isSending ? (
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaPaperPlane className="text-sm" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-6"></div>
            </div>
        </div>
    );
};

export default MessageList;