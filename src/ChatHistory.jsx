import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    ChatBubbleLeftEllipsisIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';

const ChatHistory = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchChatHistory();
        }
    }, [user]);

    const fetchChatHistory = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: true });

        if (error) {
            console.error("Error fetching chat history:", error);
        } else {
            setChatHistory(data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <div className="text-center mt-8 text-white">Loading chat history...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-normal mb-6 text-white">Chat History</h1>
            <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                {chatHistory.length > 0 ? (
                    chatHistory.map((message, index) => (
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
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No chat history available.</div>
                )}
            </div>
        </div>
    );
};

export default ChatHistory;