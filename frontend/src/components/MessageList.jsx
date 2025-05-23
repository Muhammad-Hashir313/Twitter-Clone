import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages, sendMessage } from '../features/messsages/messageSlice';
import { FaUserCircle } from 'react-icons/fa';
import socket from './Socket';

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
    const { user } = useSelector(state => state.auth);

    // Function to scroll to bottom of messages instantly
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }

    // Enhanced setup for socket connection status monitoring and online users tracking
    useEffect(() => {
        // Log socket connection status
        console.log("Socket initially connected:", socket.connected);

        const onConnect = () => {
            console.log("Socket connected");
            setSocketConnected(true);

            // Request online users list immediately after connecting
            socket.emit('getOnlineUsers');
        };

        const onDisconnect = () => {
            console.log("Socket disconnected");
            setSocketConnected(false);
        };

        // Handler for receiving online users list - this is now from Redis
        const handleOnlineUsers = (users) => {
            console.log("Online users received from Redis:", users);
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
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('onlineUsers', handleOnlineUsers);
        socket.on('userStatus', handleUserStatus);

        // Force request online users list on component mount
        if (socket.connected) {
            console.log("Already connected - requesting online users");
            socket.emit('getOnlineUsers');
        } else {
            console.log("Attempting to connect socket");
            socket.connect();
        }

        // Debug registered listeners
        console.log("Socket has onlineUsers listeners:",
            socket.hasListeners('onlineUsers'));

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

        console.log(`Changed to conversation with ${receiverId}, cleared messages`);
    }, [receiverId, user?.id]);

    // Update local messages when redux messages change
    useEffect(() => {
        // Only update if this is for the current conversation
        if (messages && messages.length > 0 && receiverId === currentChatRef.current) {
            console.log(`Updating local messages from redux for receiverId: ${receiverId}`, messages);

            // Replace messages completely instead of merging to ensure clean state
            setLocalMessages(messages);
        }
    }, [messages, receiverId]);

    // Set up socket listeners for real-time messages
    useEffect(() => {
        console.log("Setting up socket listener for receiverId:", receiverId);

        // Define the message handler
        const handleNewMessage = (data) => {
            console.log('Received message via socket:', data);

            // Only add to current chat if it's from the current conversation
            const isCurrentConversation =
                (data.senderId === Number(receiverId) && data.receiverId === user.id) ||
                (data.senderId === user.id && data.receiverId === Number(receiverId));

            if (isCurrentConversation && receiverId === currentChatRef.current) {
                console.log("Message belongs to current conversation, adding to state");

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

                    console.log("Adding new message to local state");
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
            console.log("Cleaning up socket listener");
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [receiverId, user?.id]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    useEffect(() => {
        if (receiverId && user?.id) {
            console.log(`Joining room for conversation between ${user.id} and ${receiverId}`);

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

            // Clean up when leaving the conversation
            return () => {
                console.log(`Leaving room for conversation between ${user.id} and ${receiverId}`);
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

            console.log(`Sending message to ${receiverId}: ${messageToSend}`);

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

            console.log("Socket message emitted");

            // Scroll to bottom immediately
            scrollToBottom();

            // Also send via API for persistence (backend should prevent duplication)
            dispatch(sendMessage({
                id: receiverId,
                message: { message: messageToSend, tempId: tempMessageId }
            })).then(() => {
                setIsSending(false);
                console.log("Message sent via API");

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
        console.log(`Checking if user ${userId} is online:`, isOnline,
            "Online users:", onlineUsers);
        return isOnline;
    };

    // Debug connection status display (only in development)
    const connectionStatus = (
        <div className={`absolute top-1 right-1 h-2 w-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}
            title={socketConnected ? 'Connected' : 'Disconnected'} />
    );

    if (!receiverId) {
        return (
            <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex justify-center items-center bg-black text-white border-l border-white/20">
                {connectionStatus}
                <div className="text-center">
                    <h2 className="text-xl font-bold">Select a conversation</h2>
                    <p className="text-gray-400 mt-2">Choose a user from the left to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex flex-col bg-black text-white border-l border-white/20">
            {connectionStatus}
            {/* Chat header */}
            <div className="flex items-center h-16 border-b border-white/20 px-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <FaUserCircle className="text-white text-xl" />
                        </div>
                        {/* Online/Offline indicator */}
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-black ${isUserOnline(receiverId) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold">User {receiverId}</h2>
                            <span className={`text-xs ${isUserOnline(receiverId) ? 'text-green-500' : 'text-gray-500'}`}>
                                {isUserOnline(receiverId) ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">@user{receiverId}</p>
                    </div>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-grow overflow-y-auto" ref={messagesContainerRef}>
                <div className="flex flex-col w-full gap-3 p-4">
                    {isLoading && !isSending && localMessages.length === 0 ? (
                        <div className="text-center py-8">
                            Loading messages...
                        </div>
                    ) : localMessages.length > 0 ? (
                        <>
                            {localMessages.map((message) => (
                                <div
                                    key={message.ID || message.id}
                                    className={`flex ${message.SENDER_ID === user.id ? 'justify-end' : 'justify-start'} w-full`}
                                    style={{ border: '1px solid transparent' }}
                                >
                                    <div className={`max-w-[75%] ${message.SENDER_ID === user.id ? 'bg-blue-500' : 'bg-gray-700'} 
                                        ${message.SENDER_ID === user.id ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' : 'rounded-tr-2xl rounded-tl-2xl rounded-br-2xl'}`}
                                        style={{ border: '0.5px solid transparent' }}
                                    >
                                        <div style={{ margin: '12px', width: 'calc(100% - 24px)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <p className="text-sm">{message.MESSAGE}</p>
                                            <div style={{ height: '6px' }}></div>
                                            <p className="text-xs text-gray-300 text-right">
                                                {new Date(message.CREATED_AT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Empty div for scrolling to bottom reference */}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="text-center py-8">
                            No messages yet. Send one to start the conversation!
                        </div>
                    )}
                </div>
            </div>

            {/* Message input */}
            <div className="border-t border-white/20">
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', margin: '16px' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flexGrow: 1,
                            height: '40px',
                            borderRadius: '9999px',
                            backgroundColor: '#374151',
                            color: 'white',
                            fontSize: '14px',
                            textIndent: '16px',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending || !socketConnected}
                        style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: !newMessage.trim() || isSending || !socketConnected ? 'rgba(29, 155, 240, 0.5)' : '#1D9BF0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: !newMessage.trim() || isSending || !socketConnected ? 'default' : 'pointer'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessageList;
