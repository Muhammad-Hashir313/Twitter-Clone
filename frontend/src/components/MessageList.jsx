import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages, sendMessage } from '../features/messsages/messageSlice';

const MessageList = () => {
    const [newMessage, setNewMessage] = useState('');
    const { receiverId } = useParams();
    const dispatch = useDispatch();

    const { messages, isLoading } = useSelector(state => state.message);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (receiverId) {
            dispatch(getMessages(receiverId));
        }
    }, [dispatch, receiverId]);

    // Handle sending a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            dispatch(sendMessage({
                id: receiverId,
                message: { message: newMessage.trim() }
            })).then(() => {
                setNewMessage('');
                // Refetch messages after sending
                dispatch(getMessages(receiverId));
            });
        }
    };

    if (!receiverId) {
        return (
            <div style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: '43%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                color: 'white',
                borderLeft: '1px solid rgb(47, 51, 54)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Select a conversation</h2>
                    <p style={{ color: '#9CA3AF', marginTop: '8px' }}>Choose a user from the left to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '43%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'black',
            color: 'white',
            borderLeft: '1px solid rgb(47, 51, 54)'
        }}>
            {/* Chat header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: '56px',
                borderBottom: '1px solid rgb(47, 51, 54)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '12px',
                    gap: '8px'
                }}>
                    {/* Placeholder avatar */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ color: '#9CA3AF', fontSize: '16px' }}>U</span>
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 'bold', fontSize: '14px' }}>User {receiverId}</h2>
                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>@user{receiverId}</p>
                    </div>
                </div>
            </div>

            {/* Messages area */}
            <div style={{
                flexGrow: 1,
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: '12px',
                    padding: '12px'
                }}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Loading messages...
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.ID || message.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: message.SENDER_ID === user.id ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}
                            >
                                <div style={{
                                    maxWidth: '75%',
                                    backgroundColor: message.SENDER_ID === user.id ? '#1D9BF0' : '#374151',
                                    borderRadius: message.SENDER_ID === user.id
                                        ? '16px 16px 0 16px'
                                        : '16px 16px 16px 0',
                                }}>
                                    <div style={{ padding: '8px 12px' }}>
                                        <p style={{ fontSize: '14px' }}>{message.MESSAGE}</p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#D1D5DB',
                                            marginTop: '4px',
                                            textAlign: 'right'
                                        }}>
                                            {new Date(message.CREATED_AT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            No messages yet. Send one to start the conversation!
                        </div>
                    )}
                </div>
            </div>

            {/* Message input */}
            <div style={{
                borderTop: '1px solid rgb(47, 51, 54)',
                padding: '12px'
            }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
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
                            paddingLeft: '16px',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '50%',
                            backgroundColor: !newMessage.trim() ? 'rgba(29, 155, 240, 0.5)' : '#1D9BF0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: !newMessage.trim() ? 'default' : 'pointer'
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
