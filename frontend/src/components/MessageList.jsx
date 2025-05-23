import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages, sendMessage } from '../features/messsages/messageSlice';
import { FaUserCircle } from 'react-icons/fa';

const MessageList = () => {
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { receiverId } = useParams();
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const { messages, isLoading } = useSelector(state => state.message);
    const { user } = useSelector(state => state.auth);

    // Function to scroll to bottom of messages instantly
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (receiverId) {
            dispatch(getMessages(receiverId))
                .then(() => {
                    // Scroll to bottom after messages are loaded
                    setTimeout(scrollToBottom, 50);
                });
        }
    }, [dispatch, receiverId]);

    // Handle sending a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setIsSending(true); // Set sending state to true

            // Clear input right away for better UX
            const messageToSend = newMessage.trim();
            setNewMessage('');

            // Scroll to bottom immediately when sending
            scrollToBottom();

            dispatch(sendMessage({
                id: receiverId,
                message: { message: messageToSend }
            })).then(() => {
                setIsSending(false);
                // Instead of refetching, let the next useEffect call handle it
                // or handle refresh in background without showing loading state
                dispatch(getMessages(receiverId))
                    .then(() => {
                        // Ensure we scroll to bottom after getting new messages
                        setTimeout(scrollToBottom, 50);
                    });
            });
        }
    };

    if (!receiverId) {
        return (
            <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex justify-center items-center bg-black text-white border-l border-white/20">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Select a conversation</h2>
                    <p className="text-gray-400 mt-2">Choose a user from the left to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed right-0 top-0 w-[43%] h-[100vh] flex flex-col bg-black text-white border-l border-white/20">
            {/* Chat header */}
            <div className="flex items-center h-16 border-b border-white/20 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <FaUserCircle className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="font-bold">User {receiverId}</h2>
                        <p className="text-xs text-gray-400">@user{receiverId}</p>
                    </div>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-grow overflow-y-auto" ref={messagesContainerRef}>
                <div className="flex flex-col w-full gap-3 p-4">
                    {isLoading && !isSending ? (
                        <div className="text-center py-8">
                            Loading messages...
                        </div>
                    ) : messages.length > 0 ? (
                        <>
                            {messages.map((message) => (
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
                        disabled={!newMessage.trim() || isSending}
                        style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: !newMessage.trim() || isSending ? 'rgba(29, 155, 240, 0.5)' : '#1D9BF0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: !newMessage.trim() || isSending ? 'default' : 'pointer'
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
