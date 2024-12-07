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
    CpuChipIcon,
    ArrowsPointingOutIcon
} from '@heroicons/react/24/solid';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import FullScreenChatbot from './FullScreenChatbot';

const API_KEY = "AIzaSyArRKw8RnXwURwAZ_k84aJcJG0ouGF_-jU";

const websiteContext = `
You are an AI assistant for VisionaryAI, a website that showcases various AI models for image processing and natural language understanding. The website includes the following pages and features:

1. Home: Introduces VisionaryAI and highlights key AI models.
2. About: Provides information about the VisionaryAI project and its goals.
3. Team: Introduces the team members behind VisionaryAI.
4. Contact: Offers ways to get in touch with the VisionaryAI team.
5. Project Details: Gives an overview of the technical aspects of the project.
6. Models: Showcases various AI models, including image classification and natural language processing.
7. Login/Signup: Allows users to create accounts and access personalized features.
8. Profile: Users can view and manage their account information.

The website is built using React and integrates various AI models. It aims to demonstrate the capabilities of AI in practical applications and provide an interactive experience for users interested in AI technology.

When answering questions, focus on providing information about the website, its features, and the AI models it showcases. If asked about technical details you're not sure about, you can suggest checking the Project Details page or contacting the team for more specific information.
`;

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(uuidv4());
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

    const genAI = new GoogleGenerativeAI(API_KEY);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const saveMessageToSupabase = async (message) => {
        if (user) {
            const { error } = await supabase
                .from('chat_history')
                .insert({
                    user_id: user.id,
                    session_id: sessionId,
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
        if (!input.trim() || !user) return;

        setIsLoading(true);
        const userMessage = { text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');

        await saveMessageToSupabase(userMessage);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `${websiteContext}\n\nUser: ${input}\nAI Assistant:`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const botMessage = { text, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, botMessage]);
            await saveMessageToSupabase(botMessage);
        } catch (error) {
            console.error("Error in AI call:", error);
            const errorMessage = { text: "I apologize, but I encountered an error. Please try asking your question again.", sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            await saveMessageToSupabase(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSessionId(uuidv4());
            setMessages([]);
        }
    };

    const AILogo = () => (
        <motion.div
            className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <CpuChipIcon className="h-8 w-8 text-white" />
        </motion.div>
    );

    const openFullScreenChatbot = () => {
        setIsFullScreenOpen(true);
        setIsOpen(false);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-4 right-4 w-96 h-[70vh] bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
                    >
                        <div className="p-4 bg-purple-600 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <CpuChipIcon className="h-6 w-6 text-white" />
                                <h2 className="text-xl font-normal text-white">VisionaryAI Assistant</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={openFullScreenChatbot}
                                    className="text-white hover:text-gray-300 transition-colors"
                                    title="Full Screen"
                                >
                                    <ArrowsPointingOutIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={toggleChatbot}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        {message.sender === 'user' ? (
                                            <UserCircleIcon className="h-6 w-6 text-blue-400" />
                                        ) : (
                                            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-purple-400" />
                                        )}
                                        <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-600 text-white'}`}>
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
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 bg-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-grow px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    placeholder="Ask about VisionaryAI..."
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                    disabled={isLoading}
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isOpen && (
                <motion.button
                    onClick={toggleChatbot}
                    className="fixed bottom-4 right-4 rounded-full shadow-lg focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AILogo />
                </motion.button>
            )}
            <FullScreenChatbot
                isOpen={isFullScreenOpen}
                onClose={() => setIsFullScreenOpen(false)}
            />
        </>
    );
};

export default Chatbot;
