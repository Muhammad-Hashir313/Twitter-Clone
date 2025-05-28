import { useState, useRef, useEffect } from "react";
import axios from "axios";
import LeftSidebar from '../pages/left sidebar/LeftSidebar'
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat, isTyping]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = { role: "user", content: message };
        setChat((prev) => [...prev, userMessage]);
        setMessage("");
        setIsTyping(true);

        try {
            const res = await axios.post("/api/chatBot", { message });
            const botMessage = { role: "bot", content: res.data.reply };
            setChat((prev) => [...prev, botMessage]);
        } catch (err) {
            setChat((prev) => [
                ...prev,
                { role: "bot", content: "Error: AI failed to respond." },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey && !isTyping) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <LeftSidebar />
            <div className="min-h-screen bg-black">
                {/* Mobile top spacer */}
                <div className="h-14 lg:hidden"></div>

                {/* Main content container */}
                <div className="flex">
                    {/* Desktop sidebar spacer */}
                    <div className="w-80 hidden lg:block"></div>

                    {/* Content area */}
                    <div className="flex-1 flex flex-col min-h-screen">
                        {/* Header */}
                        <div className="flex-shrink-0 border-b border-gray-800/50">
                            <div className="h-6"></div>
                            <div className="relative left-6 text-center lg:text-left">
                                <div className="w-4"></div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    ChatBot AI 🤖
                                </h1>
                                <p className="text-gray-500 text-sm mt-2">
                                    Your intelligent conversation partner
                                </p>
                            </div>
                            <div className="h-6"></div>
                        </div>

                        {/* Chat messages area */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 overflow-y-auto">
                                <div className="w-full max-w-4xl mx-auto">
                                    <div className="space-y-4">
                                        <div className="h-4"></div>

                                        {chat.length === 0 ? (
                                            <div className="flex items-center justify-center min-h-96">
                                                <div className="text-center space-y-6">
                                                    <div className="relative">
                                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
                                                            <FaRobot className="text-white text-3xl" />
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            Welcome to ChatBot AI
                                                        </h3>
                                                        <p className="text-gray-400 max-w-md">
                                                            Start a conversation! Ask me anything - from coding help to creative writing, I'm here to assist you.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 justify-center max-w-md">
                                                        {["What can you help with?", "Write a poem", "Explain quantum physics", "Help me code"].map((suggestion, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setMessage(suggestion)}
                                                                className="text-xs bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 hover:scale-105"
                                                                style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px' }}
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {chat.map((item, idx) => (
                                                    <div key={idx} className="group">
                                                        <div className="flex gap-4 w-full">
                                                            <div className="w-4"></div>

                                                            {/* Avatar */}
                                                            <div className="flex-shrink-0">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800 group-hover:ring-opacity-50 transition-all duration-300 ${item.role === "user"
                                                                    ? "bg-gradient-to-br from-blue-500 to-purple-600 group-hover:ring-blue-500/50"
                                                                    : "bg-gradient-to-br from-green-500 to-emerald-600 group-hover:ring-green-500/50"
                                                                    }`}>
                                                                    {item.role === "user" ? (
                                                                        <FaUser className="text-white text-sm" />
                                                                    ) : (
                                                                        <FaRobot className="text-white text-sm" />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Message content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className={`text-sm font-semibold ${item.role === "user" ? "text-blue-400" : "text-green-400"
                                                                        }`}>
                                                                        {item.role === "user" ? "You" : "AI Assistant"}
                                                                    </span>
                                                                    <span className="text-gray-600 text-xs">now</span>
                                                                </div>
                                                                <div className={`rounded-2xl border transition-all duration-300 group-hover:border-opacity-60 ${item.role === "user"
                                                                    ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 group-hover:border-blue-500/40"
                                                                    : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 group-hover:border-gray-600/50"
                                                                    }`}
                                                                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
                                                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                                        {item.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-4"></div>
                                                        </div>
                                                        <div className="h-6"></div>
                                                    </div>
                                                ))}

                                                {isTyping && (
                                                    <div className="group">
                                                        <div className="flex gap-4 w-full">
                                                            <div className="w-4"></div>
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800 animate-pulse">
                                                                    <FaRobot className="text-white text-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-sm font-semibold text-green-400">AI Assistant</span>
                                                                    <span className="text-gray-600 text-xs">typing...</span>
                                                                </div>
                                                                <div className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30"
                                                                    style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                                        <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-4"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                            </div>

                            {/* Input area */}
                            <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/80 backdrop-blur-sm">
                                <div className="h-4"></div>
                                <div className="w-full max-w-4xl mx-auto">
                                    <div style={{ marginLeft: '16px', marginRight: '16px' }}>
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
                                                        placeholder="Ask me anything... (Press Enter to send)"
                                                        className="flex-1 bg-transparent text-gray-200 outline-none placeholder-gray-500"
                                                        style={{ paddingTop: '16px', paddingBottom: '16px' }}
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        onKeyDown={handleKeyPress}
                                                        disabled={isTyping}
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleSend}
                                                    disabled={isTyping || !message.trim()}
                                                    className={`
                                                        flex items-center justify-center transition-all duration-300 transform
                                                        ${isTyping || !message.trim()
                                                            ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                                                        }
                                                    `}
                                                    style={{ width: '56px', height: '56px', margin: '8px' }}
                                                >
                                                    {isTyping ? (
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;