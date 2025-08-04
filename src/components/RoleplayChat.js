import React from 'react';
import { User, Send, Bot, Download, ArrowLeft, Users } from 'lucide-react';

export const RoleplayChat = ({ persona, history, userInput, setUserInput, handleSubmit, isLoading, chatEndRef, onBack, onHome }) => {
    
    const handleDownloadChat = () => {
        let content = `Chat History with ${persona.name}\n`;
        content += `========================================\n\n`;

        (history || []).forEach(msg => {
            const prefix = msg.role === 'user' ? 'You' : persona.name;
            content += `${prefix}:\n${msg.text}\n\n----------------------------------------\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-with-${persona.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-yellow-100 overflow-hidden">
            <header className="p-4 border-b-4 border-black flex justify-between items-center bg-yellow-200 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-black">Chatting with {persona.name}</h2>
                    <p className="text-sm text-green-700 font-semibold">Truth Serum: ON</p>
                </div>
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="p-2 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black hover:bg-yellow-500 transition" title="Back to Persona">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                     <button onClick={onHome} className="p-2 bg-green-400 text-black font-bold rounded-lg border-2 border-black hover:bg-green-500 transition" title="Back to Library">
                        <Users className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownloadChat} className="p-2 bg-blue-400 text-black font-bold rounded-lg border-2 border-black hover:bg-blue-500 transition" title="Download Chat">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto min-h-0 p-6 space-y-6">
                {(history || []).map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                            <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black flex items-center justify-center text-black font-bold flex-shrink-0 text-xl">
                                {persona.name.charAt(0)}
                            </div>
                        )}
                        <div className={`max-w-md p-4 rounded-xl border-2 border-black ${msg.role === 'user' ? 'bg-green-300' : 'bg-blue-200'}`}>
                            <p className="text-md text-black">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center text-black flex-shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black flex items-center justify-center text-black font-bold flex-shrink-0">
                           <Bot className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="max-w-md p-4 rounded-xl border-2 border-black bg-blue-200">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-black rounded-full animate-bounce"></span>
                                <span className="w-3 h-3 bg-black rounded-full animate-bounce delay-75"></span>
                                <span className="w-3 h-3 bg-black rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t-4 border-black bg-yellow-100 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={`Ask ${persona.name} anything...`}
                        className="w-full p-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-black transition text-lg"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-blue-400 text-black rounded-lg border-2 border-black hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};
