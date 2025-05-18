import React, { useState } from 'react';

const MessageList = () => {
    const [newMessage, setNewMessage] = useState('');

    // Sample messages - in a real app, these would come from your backend
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'other',
            text: 'Hey there! How are you doing?',
            timestamp: '10:30 AM'
        },
        {
            id: 2,
            sender: 'me',
            text: 'I\'m good! Just working on this Twitter clone project.',
            timestamp: '10:32 AM'
        },
        {
            id: 3,
            sender: 'other',
            text: 'That sounds interesting! What tech stack are you using?',
            timestamp: '10:33 AM'
        },
        {
            id: 4,
            sender: 'me',
            text: 'I\'m using MERN stack with MySQL instead of MongoDB.',
            timestamp: '10:35 AM'
        },
        {
            id: 5,
            sender: 'other',
            text: 'Nice choice! How\'s the progress going?',
            timestamp: '10:36 AM'
        }
    ]);

    // Handle sending a new message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'me',
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

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
                        <h2 style={{ fontWeight: 'bold', fontSize: '14px' }}>Username</h2>
                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>@username</p>
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
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                                width: '100%'
                            }}
                        >
                            <div style={{
                                maxWidth: '75%',
                                backgroundColor: message.sender === 'me' ? '#1D9BF0' : '#374151',
                                borderRadius: message.sender === 'me'
                                    ? '16px 16px 0 16px'
                                    : '16px 16px 16px 0',
                            }}>
                                <div style={{ padding: '8px 12px' }}>
                                    <p style={{ fontSize: '14px' }}>{message.text}</p>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#D1D5DB',
                                        marginTop: '4px',
                                        textAlign: 'right'
                                    }}>{message.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
