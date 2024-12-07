import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftEllipsisIcon,
    UserCircleIcon,
    PlusIcon,
    Bars3Icon
} from '@heroicons/react/24/solid';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const API_KEY = "AIzaSyArRKw8RnXwURwAZ_k84aJcJG0ouGF_-jU";

const FullScreenChatbot = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const genAI = new GoogleGenerativeAI(API_KEY);

    useEffect(() => {
        if (isOpen && user) {
            fetchChatHistory();
        }
    }, [isOpen, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat]);

    const fetchChatHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_history')
                .select('*')
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false });

            if (error) throw error;

            const groupedHistory = groupChatHistory(data);
            setChatHistory(groupedHistory);

            if (groupedHistory.length > 0) {
                setActiveChat(groupedHistory[0]);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const groupChatHistory = (data) => {
        const grouped = {};
        data.forEach(message => {
            if (!grouped[message.session_id]) {
                grouped[message.session_id] = {
                    id: message.session_id,
                    title: message.content.split(' ').slice(0, 5).join(' ') + '...',
                    messages: []
                };
            }
            grouped[message.session_id].messages.push(message);
        });
        
        // Sort messages within each chat session chronologically
        Object.values(grouped).forEach(chat => {
            chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
        
        // Convert to array and sort chat sessions by most recent message
        return Object.values(grouped).sort((a, b) => {
            const lastMessageA = a.messages[a.messages.length - 1];
            const lastMessageB = b.messages[b.messages.length - 1];
            return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
        });
    };

    const saveMessageToSupabase = async (message) => {
        if (user) {
            const { error } = await supabase
                .from('chat_history')
                .insert({
                    user_id: user.id,
                    session_id: activeChat.id,
                    sender: message.sender,
                    content: message.text,
                    timestamp: new Date().toISOString()
                });

            if (error) {
                console.error("Error saving message to Supabase:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        const userMessage = { text: input, sender: 'user' };
        const updatedMessages = [...activeChat.messages, userMessage];
        setActiveChat({ ...activeChat, messages: updatedMessages });
        setInput('');

        await saveMessageToSupabase(userMessage);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `User: ${input}\nAI Assistant:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const botMessage = { text, sender: 'bot' };
            const newMessages = [...updatedMessages, botMessage];
            setActiveChat({ ...activeChat, messages: newMessages });
            await saveMessageToSupabase(botMessage);

            setChatHistory(prevHistory => {
                const updatedHistory = prevHistory.map(chat =>
                    chat.id === activeChat.id
                        ? { ...chat, title: input.split(' ').slice(0, 5).join(' ') + '...' }
                        : chat
                );
                return updatedHistory;
            });

        } catch (error) {
            console.error("Error in AI call:", error);
            const errorMessage = { text: "I apologize, but I encountered an error. Please try again.", sender: 'bot' };
            setActiveChat({ ...activeChat, messages: [...updatedMessages, errorMessage] });
            await saveMessageToSupabase(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        const newChatId = uuidv4();
        const newChat = {
            id: newChatId,
            title: 'New Chat',
            messages: []
        };
        setChatHistory([newChat, ...chatHistory]);
        setActiveChat(newChat);
        setIsSidebarOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-50 flex flex-col md:flex-row">
            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 bottom-0 w-64 md:w-80 bg-gray-800 bg-opacity-95 backdrop-blur-lg p-4 overflow-y-auto flex flex-col border-r border-gray-700 z-50"
                    >
                        <button
                            onClick={startNewChat}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg mb-6 flex items-center justify-center hover:bg-indigo-700 transition duration-300 shadow-lg"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            New Chat
                        </button>
                        <div className="flex-grow overflow-y-auto space-y-2">
                            {chatHistory.map((chat) => (
                                <motion.div
                                    key={chat.id}
                                    onClick={() => {
                                        setActiveChat(chat);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`p-3 rounded-lg cursor-pointer transition duration-300 ${activeChat?.id === chat.id
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'hover:bg-gray-700 text-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {chat.title}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900 bg-opacity-50 backdrop-blur-lg">
                {/* Chat Header */}
                <div className="bg-gray-800 bg-opacity-50 p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white mr-4 hover:text-indigo-400 transition duration-300"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-normal text-white">Visionary Chat</h2>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-indigo-400 transition duration-300">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    {activeChat?.messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {message.sender === 'user' ? (
                                    <UserCircleIcon className="h-8 w-8 md:h-10 md:w-10 text-indigo-400" />
                                ) : (
                                    <ChatBubbleLeftEllipsisIcon className="h-8 w-8 md:h-10 md:w-10 text-purple-400" />
                                )}
                                <div className={`max-w-[75%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-lg ${message.sender === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-white'
                                    }`}>
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        {...props}
                                                        children={String(children).replace(/\n$/, '')}
                                                        style={atomDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                    />
                                                ) : (
                                                    <code {...props} className={className}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {message.content || message.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Loading Bar */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                            transition={{ duration: 0.5 }}
                            className="h-1 bg-indigo-600"
                            style={{ transformOrigin: "0% 50%" }}
                        />
                    )}
                </AnimatePresence>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 bg-gray-800 bg-opacity-50">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow px-4 py-2 md:py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-inner text-sm md:text-base"
                            placeholder="Ask me anything..."
                        />
                        <button
                            type="submit"
                            className="px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-lg"
                            disabled={isLoading}
                        >
                            <PaperAirplaneIcon className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FullScreenChatbot;
