import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';
import { Loader } from './Loader';

// A simple markdown-to-HTML converter
const renderMarkdown = (text: string) => {
    // Bold: **text** -> <strong>text</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-brand-text">$1</strong>');
    // Newlines -> <br>
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
};

interface ChatProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };
    
    return (
        <div className="flex flex-col h-full max-h-72">
            <div className="flex-grow p-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-accent text-brand-primary rounded-br-none' : 'bg-black/20 text-brand-subtle rounded-bl-none'}`}>
                           <p dangerouslySetInnerHTML={renderMarkdown(msg.content)}></p>
                        </div>
                    </motion.div>
                ))}
                 {isLoading && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                         <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-black/20">
                             <Loader />
                         </div>
                     </motion.div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-2 mt-4 flex items-center bg-black/20 border border-glass-border rounded-xl focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a follow-up..."
                    className="flex-grow bg-transparent focus:outline-none px-2 text-sm text-brand-text placeholder-brand-subtle"
                    disabled={isLoading}
                />
                <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-lg bg-brand-accent disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <SendIcon className="h-5 w-5 text-brand-primary" />
                </motion.button>
            </form>
        </div>
    );
};
