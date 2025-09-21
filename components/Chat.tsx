
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';
import { Loader } from './Loader';

// A simple markdown-to-HTML converter
const renderMarkdown = (text: string) => {
    // Bold: **text** -> <strong>text</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
        onSendMessage(input);
        setInput('');
    };
    
    return (
        <div className="flex flex-col h-64 bg-brand-primary rounded-lg">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-brand-secondary text-brand-text'}`}>
                           <p dangerouslySetInnerHTML={renderMarkdown(msg.content)}></p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="px-4 py-2 rounded-lg bg-brand-secondary">
                             <Loader />
                         </div>
                     </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-2 border-t border-brand-border flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about the analysis..."
                    className="flex-grow bg-transparent focus:outline-none px-2 text-sm"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="p-2 rounded-md hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed">
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};
